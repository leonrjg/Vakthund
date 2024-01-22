import React from "react";
import {Link} from "react-router-dom";

function ErrorNotFound() {
    return (
        <div className="text-center m-3">
            <h2>404 Not Found</h2>
            <Link to="/">
                <button
                    style={{backgroundColor: "#b45b35", border: "none"}}
                    className="btn btn-primary mx-2"
                >
                    Home page
                </button>
            </Link>
        </div>
    );
}

export default ErrorNotFound;
