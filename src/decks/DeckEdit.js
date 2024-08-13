import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateDeck, readDeck } from "../utils/api";

function DeckEdit() {
    const initialFormState = {
        id: 0,
        name: "",
        description: "",
    };
    const [formData, setFormData] = useState({ ...initialFormState });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { deckId } = useParams();

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    function handleSubmit(event) {
        const abortController = new AbortController();
        event.preventDefault();
        updateDeck(formData, abortController.signal)
            .then(() => {
                setFormData({ ...initialFormState });
                navigate(-1);
            })
            .catch(console.log);

        return () => abortController.abort();
    }

    function handleCancel() {
        navigate(-1);
    }

    useEffect(() => {
        const abortController = new AbortController();

        readDeck(deckId, abortController.signal)
            .then((deck) => {
                setFormData({
                    id: Number(deckId),
                    name: deck.name || "",
                    description: deck.description || ""
                });
                setLoading(false);
            })
            .catch(console.log);

        return () => abortController.abort();
    }, [deckId]);

    if (loading) {
        return <p>Loading...</p>; // Show a loading state while fetching data
    }

    return (
        <>
            {/* There is a breadcrumb navigation bar with a link to home / followed by the text Create Deck (i.e., Home/Edit Deck). */}
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Edit Deck</li>
                    </ol>
                </nav>
            </div>

            <h2>Edit Deck</h2>

            {/* It displays the same form as the Create Deck screen, except it is prefilled with information for the existing deck. */}
            {/* If the user clicks Cancel, the user is taken to the Deck screen. */}

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
                        value={formData.name}
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
                        value={formData.description}
                    />
                </div>
                <button type="button" className="btn btn-secondary mr-1" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary mr-1" onClick={handleSubmit}>Submit</button>
            </form>
        </>
    );
}

export default DeckEdit;