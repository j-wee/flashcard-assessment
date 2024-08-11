import React from "react";
import DeckList from "../decks/DeckList";

function Home() {
    return (
        <>
            <h2 className="row">Home</h2>
            <button className="btn btn-secondary btn-lg">+ Create Deck</button>

            <DeckList />
        </>
    );
}

export default Home;