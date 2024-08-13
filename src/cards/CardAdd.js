import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createCard, readDeck } from "../utils/api";

function CardAdd() {
    const initialFormState = {
        front: "",
        back: "",
    };
    const [deck, setDeck] = useState({});
    const [formData, setFormData] = useState({ ...initialFormState });
    const navigate = useNavigate();
    const { deckId } = useParams();

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    function handleSubmit(event) {
        const abortController = new AbortController();
        event.preventDefault();
        createCard(deckId, formData, abortController.signal)
            .then(() => setFormData({ ...initialFormState }))
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

        return () => abortController.abort();
    }, [deckId]);

    return (
        <>
            {/* There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck to which the cards are being added, and finally the text Add Card (e.g., Home/React Router/Add Card */}
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deck.name}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Card</li>
                    </ol>
                </nav>
            </div>

            {/* The screen displays the React Router: Add Card deck title. */}
            <h2>Add Card</h2>

            {/* A form is shown with the "front" and "back" fields for a new card. Both fields use a <textarea> tag that can accommodate multiple lines of text. */}
            {/* If the user clicks Save, a new card is created and associated with the relevant deck. Then the form is cleared and the process for adding a card is restarted. */}
            {/* If the user clicks Done, the user is taken to the Deck screen. */}

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

export default CardAdd;