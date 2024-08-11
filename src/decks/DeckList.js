import React from "react";

function DeckList() {
    return (
        <>
            <h2 className="row">DeckList</h2>
            <div className="container row mt-3">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Rendering in React</h4>

                        <p className="card-text">Some example text. Some example text.</p>

                        <button type="button" className="btn btn-primary mr-1">View</button>
                        <button type="button" className="btn btn-secondary mr-1">Study</button>
                        <button type="button" className="btn btn-danger">Delete</button>
                        <div className="row">
                            <div className="col text-right">
                                <span className="badge badge-light">3 cards</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default DeckList;