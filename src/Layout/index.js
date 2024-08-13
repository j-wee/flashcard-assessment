import React from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import DeckAdd from "../decks/DeckAdd";
import Deck from "../decks/Deck";
import DeckEdit from "../decks/DeckEdit";
import DeckStudy from "../decks/DeckStudy";
import CardAdd from "../cards/CardAdd";
import CardEdit from "../cards/CardEdit";

function Layout() {
  return (
    <>
      <Header />
      <div className="container">
        {/* TODO: Implement the screen starting here */}
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/decks/new" element={<DeckAdd />} />
              <Route path="/decks/:deckId" element={<Deck />}>
                  <Route path="study" element={<DeckStudy />} />
                  <Route path="edit" element={<DeckEdit />} />
                  <Route path="cards/new" element={<CardAdd />} />
                  <Route path="cards/:cardId/edit" element={<CardEdit />} />
              </Route>
              <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
    </>
  );
}

export default Layout;
