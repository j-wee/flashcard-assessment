import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createDeck, listDecks } from "../utils/api/index";

function DeckAdd() {
    const initialFormState = {
        name: "",
        description: "",
    };
    const [decks, setDecks] = useState([]);
    const [formData, setFormData] = useState({ ...initialFormState });
    const navigate = useNavigate();

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    function handleSubmit(event) {
        const abortController = new AbortController();
        const deckCount = decks.length;
        event.preventDefault();
        createDeck(formData, abortController.signal)
            .then((deck) => navigate(`/decks/${deckCount + 1}`))
            .catch(console.log);
        setFormData({ ...initialFormState });
    }

    function handleCancel() {
        navigate("/");
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
            {/* There is a breadcrumb navigation bar with a link to home / followed by the text Create Deck (i.e., Home/Create Deck). */}
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Create Deck</li>
                    </ol>
                </nav>
            </div>

            <h2>Create Deck</h2>

            {/* The name field is an <input> field of type text */}
            {/* The description field is a <textarea> field that can be multiple lines of text. */}
            {/* If the user clicks Submit, the user is taken to the Deck screen. */}
            {/* If the user clicks Cancel, the user is taken to the Home screen. */}

            <form>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        aria-describedby="name"
                        placeholder="Deck Name"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        placeholder="Brief description of the deck"
                        rows="3"
                        onChange={handleChange}
                    />
                </div>
                <button type="button" className="btn btn-secondary mr-1" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary mr-1" onClick={handleSubmit}>Submit</button>
            </form>
        </>
    );
}

export default DeckAdd;