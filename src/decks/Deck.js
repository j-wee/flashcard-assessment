import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteCard, deleteDeck, listDecks, readDeck } from "../utils/api";

function Deck() {
    const [deck, setDeck] = useState({});
    const [showDetails, setShowDetails] = useState(true);

    const location = useLocation();
    const { deckId } = useParams();
    const navigate = useNavigate();

    const handleEditDeck = async(deckId) => {
        navigate(`/decks/${deckId}/edit`);
    }

    const handleStudy = async(deckId) => {
        navigate(`/decks/${deckId}/study`);
    }

    const handleAddCards = async(deckId) => {
        navigate(`/decks/${deckId}/cards/new`);
    }

    const handleDeleteDeck = async(deckId) => {
        const abortController = new AbortController();
        const result = window.confirm("Delete this deck?\n\nYou will not be able to recover it.");

        if (result) {
            await deleteDeck(deckId, abortController.signal)
                .then(() => listDecks(abortController.signal))
                .catch(console.log);

            navigate("/");
        }
    }

    const handleEditCard = async(cardId, deckId) => {
        navigate(`/decks/${deckId}/cards/${cardId}/edit`);
    }

    /*
        When the user clicks the Delete button associated with a card, a warning message is shown and the user
        can click OK or Cancel. If the user clicks OK, the card is deleted.
     */
    const handleDeleteCard = async(cardId, deckId) => {
        const abortController = new AbortController();
        const result = window.confirm("Delete this card?\n\nYou will not be able to recover it.");

        if (result) {
            await deleteCard(cardId, abortController.signal)
                .then(() => readDeck(deckId, abortController.signal))
                .then(setDeck)
                .catch(console.log);
        }
    }

    useEffect(() => {
        // handle edit and add cards location
        if (location.pathname.includes("study") || location.pathname.includes("cards") || location.pathname.includes("edit")) {
            setShowDetails(false);
        } else {
            setShowDetails(true);
        }
    }, [location]);

    useEffect(() => {
        const abortController = new AbortController();

        readDeck(deckId, abortController.signal)
            .then(setDeck)
            .catch(console.log);

        return () => abortController.abort();
    }, [deckId, location]);

    return (
        <div>
            {
                showDetails && (
                    <>
                        <div>
                            {/* There is a breadcrumb navigation bar with a link to home / followed by the name of the deck (e.g., Home/React Router). */}
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">{deck.name}</li>
                                </ol>
                            </nav>
                        </div>

                        {/* The screen includes the deck name (e.g., "React Router") and deck description (e.g., "React Router is a collection of navigational components that compose declaratively in your application"). */}
                        {/* The screen includes Edit, Study, Add Cards, and Delete buttons */}
                        <div>
                            <h2>{deck.name}</h2>
                            <p>{deck.description}</p>

                            <button type="button"
                                    className="btn btn-secondary mr-1"
                                    onClick={() => handleEditDeck(deck.id)}
                            >
                                Edit
                            </button>

                            <button type="button"
                                    className="btn btn-primary mr-1"
                                    onClick={() => handleStudy(deck.id)}
                            >
                                Study
                            </button>

                            <button type="button"
                                    className="btn btn-primary mr-1"
                                    onClick={() => handleAddCards(deck.id)}
                            >
                                Add Cards
                            </button>

                            <button type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteDeck(deck.id)}
                            >
                                Delete
                            </button>
                        </div>

                        <div className="col-12">
                            <h3 className="card-title row mt-3">Cards</h3>

                            <div className="container row mt-3">
                                { deck.cards && deck.cards.length > 0 ? (
                                    deck.cards.map((card) => (
                                        <div className="col-12" key={card.id}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <p className="card-text">{card.front}</p>
                                                    <p className="card-text">{card.back}</p>

                                                    <button type="button" className="btn btn-secondary mr-1"
                                                            onClick={() => handleEditCard(card.id, deck.id)}>
                                                        Edit
                                                    </button>

                                                    <button type="button" className="btn btn-danger"
                                                            onClick={() => handleDeleteCard(card.id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No cards available.</p>
                                )}
                            </div>
                        </div>
                        <br />

                    </>
                )
            }
            <Outlet/>

        </div>
    );
}

export default Deck;