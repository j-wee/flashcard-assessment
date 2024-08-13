import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateCard, readCard, readDeck } from "../utils/api";

function CardEdit() {
    const initialFormState = {
        front: "",
        back: "",
        deckId: 0,
        id: 0,
    };
    const [deck, setDeck] = useState({});
    const [formData, setFormData] = useState({ ...initialFormState });
    const navigate = useNavigate();
    const { deckId, cardId } = useParams();
    const [loading, setLoading] = useState(true);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    function handleSubmit(event) {
        const abortController = new AbortController();
        event.preventDefault();
        updateCard(formData, abortController.signal)
            .then(() => setFormData({ ...initialFormState }))
            .then(() => navigate(`/decks/${deckId}`))
            .catch(console.log);

        return () => abortController.abort();
    }

    function handleDone() {
        navigate(`/decks/${deckId}`);
    }

    useEffect(() => {
        const abortController = new AbortController();

        readDeck(deckId, abortController.signal)
            .then(setDeck)
            .catch(console.log);

        readCard(cardId, abortController.signal)
            .then((card) => {
                setFormData({
                    id: Number(cardId),
                    deckId: Number(deckId),
                    front: card.front || "",
                    back: card.back || ""
                });
                setLoading(false);
            })
            .catch(console.log);

        return () => abortController.abort();
    }, [deckId, cardId]);

    if (loading) {
        return <p>Loading...</p>; // Show a loading state while fetching data
    }

    return (
        <>
            {/* There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck of which the edited card is a member, and finally the text Edit Card :cardId (e.g., Home/Deck React Router/Edit Card 4). */}
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><a href={`/decks/${deckId}`}>{deck.name}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Edit Card</li>
                    </ol>
                </nav>
            </div>

            <h2>Edit Card</h2>

            {/* If the user clicks on either Save or Cancel, the user is taken to the Deck screen. */}

            <form>
                <div className="form-group">
                    <label htmlFor="front">Front</label>
                    <textarea
                        className="form-control"
                        id="front"
                        name="front"
                        placeholder="Front side of card"
                        rows="2"
                        onChange={handleChange}
                        value={formData.front}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="back">Back</label>
                    <textarea
                        className="form-control"
                        id="back"
                        name="back"
                        placeholder="Back side of card"
                        rows="2"
                        onChange={handleChange}
                        value={formData.back}
                    />
                </div>
                <button type="button" className="btn btn-secondary mr-1" onClick={handleDone}>Done</button>
                <button type="submit" className="btn btn-primary mr-1" onClick={handleSubmit}>Save</button>
            </form>
        </>
    );
}

export default CardEdit;