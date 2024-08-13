import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDeck, listDecks } from "../utils/api";

function Home() {
    const [decks, setDecks] = useState([]);

    const navigate = useNavigate();

    const handleCreateDeck = async() => {
        navigate("/decks/new");
    }

    const handleViewDeck = async(deckId) => {
        navigate(`/decks/${deckId}`);
    }

    const handleStudyDeck = async(deckId) => {
        navigate(`/decks/${deckId}/study`);
    }

    /*
        When the user clicks the Delete button, a warning message is shown and the user can click OK or Cancel.
        If the user clicks OK, the deck is deleted and the deleted deck is no longer visible on the Home screen.
        The user can delete a deck by clicking the Delete button on the home screen.
     */
    const handleDeleteDeck = async(deckId) => {
        const abortController = new AbortController();
        const result = window.confirm("Delete this deck?\n\nYou will not be able to recover it.");

        if (result) {
            await deleteDeck(deckId, abortController.signal)
                .then(() => listDecks(abortController.signal))
                .then(setDecks)
                .catch(console.log);
        }
    }

    useEffect(() => {
        const abortController = new AbortController();

        listDecks(abortController.signal)
            .then(setDecks)
            .catch(console.log);

        return () => abortController.abort();
    }, []);

    return (
        <>
            {/* A Create Deck button is shown, and clicking it brings the user to the Create Deck screen. */}
            <button className="btn btn-secondary btn-lg" onClick={handleCreateDeck}>+ Create Deck</button>

            {/* Existing decks are each shown with the deck name, the number of cards, and a Study, View, and Delete button. */}
            <div className="container row mt-3">
                {
                    decks.map((deck) => (
                        <div className="col-12" key={deck.id}>
                            <div className="card" key={deck.id}>
                                <div className="card-body">
                                    <h3 className="card-title">{deck.name}</h3>

                                    <p className="card-text">{deck.description}</p>

                                    {/* Clicking the View button brings the user to the Deck screen. */}
                                    <button type="button" className="btn btn-primary mr-1"
                                            onClick={() => handleViewDeck(deck.id)}>View
                                    </button>

                                    {/* Clicking the Study button brings the user to the Study screen. */}
                                    <button type="button" className="btn btn-secondary mr-1"
                                            onClick={() => handleStudyDeck(deck.id)}>Study
                                    </button>

                                    {/* Clicking the Delete button shows a warning message before deleting the deck. */}
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleDeleteDeck(deck.id)}>Delete
                                    </button>

                                    <div className="row">
                                        <div className="col text-right">
                                            <span className="badge badge-light">{deck.cards.length} cards</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Home;