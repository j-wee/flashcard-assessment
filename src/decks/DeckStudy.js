import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readDeck } from "../utils/api";

function DeckStudy() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardIndex, setCardIndex] = useState(0);
    const cardCount = deck.cards ? deck.cards.length : 0;
    const viewError = cardCount <= 2;
    const navigate = useNavigate();

    const handleAddCards  = async(deckId) => {
        navigate(`/decks/${deckId}/cards/new`);
    }

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    }

    const handleNext = () => {
        if (cardIndex + 1 < cardCount) {
            setCardIndex(cardIndex + 1);
            setIsFlipped(false);
        } else {
            const result = window.confirm("Restart cards?\n\nClick 'Cancel' to return to the home page.");
            if (result) {
                setCardIndex(0);
                setIsFlipped(false);
            } else {
                navigate("/");
            }
        }
    }

    useEffect(() => {
        const abortController = new AbortController();

        readDeck(deckId, abortController.signal)
            .then(setDeck)
            .catch(console.log);

        return () => abortController.abort();
    }, [deckId]);

    return (
        <>
            {/* There is a breadcrumb navigation bar with links to home /, followed by the name of the deck being studied, and finally the text Study (e.g., Home/Rendering In React/Study). */}
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href={`/decks/${deckId}`}>{deck.name}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Study</li>
                    </ol>
                </nav>
            </div>

            {/* The deck title (i.e., "Study: Rendering in React" ) is shown on the screen. */}
            <h2>{deck.name}: Study</h2>

            <div className="container row mt-3">
                {/* Studying a deck with two or fewer cards should display a "Not enough cards" message (e.g., "Not enough cards. You need at least 3 cards to study. There are 2 cards in this deck."). */}
                {
                    viewError ? (
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Not enough cards.</h3>
                                <p className="card-text">
                                    You need at least 3 cards to study. There are {cardCount} cards in this deck.
                                </p>
                                <button className="btn btn-primary" onClick={() => handleAddCards(deck.id)}>Add Cards</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* A card is shown, with a question on the front-side and the answer on the back-side. */}
                            <div className="card">
                                <div className="card-body">
                                    {/* The number of cards remaining in the deck is shown. */}
                                    <h3 className="card-title">Card {cardIndex + 1} of {cardCount}</h3>
                                    <p className="card-text">{deck.cards && (isFlipped ? deck.cards[cardIndex].back : deck.cards[cardIndex].front)}</p>

                                    {/* A button at the bottom of each card "flips" it, and shows the back-side. */}
                                    {/* After flipping the card, the user is shown a "Next" button to continue to the next card. */}
                                    <button className="btn btn-secondary mr-1" onClick={handleFlip}>Flip</button>

                                    {/* When the user reaches the end of the deck, they have the option to restart the deck or return to the home screen. */}
                                    {isFlipped && <button className="btn btn-primary mr-1" onClick={handleNext}>Next</button>}
                                </div>
                            </div>
                        </>
                    )
                }


            </div>
        </>
    );
}

export default DeckStudy;