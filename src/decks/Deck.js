import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

function Deck() {
    const [showDetails, setShowDetails] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("study")) {
            setShowDetails(false);
        } else {
            setShowDetails(true);
        }
    }, [location]);

    return (
        <div>
            {showDetails && <h2>Deck Details</h2>}
            <Outlet />
        </div>
    );
}

export default Deck;