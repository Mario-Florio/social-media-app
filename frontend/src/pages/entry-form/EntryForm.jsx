import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./styles.css";
import SignIn from "./signIn/SignIn";
import SignUp from "./signUp/SignUp";

import { useAuth } from "../../hooks/useAuth";

function EntryForm({ setUser }) {
    const [isSignIn, setIsSignIn] = useState(true);

    const { user } = useAuth();

    if (user) {
        return <Navigate to="/" />;
    }

    return(
        <div className="entryForm-bg">
            <div className="headings-container">
                <h1>Social Media App</h1>
                <p>Stay Connected</p>
            </div>
            { isSignIn ?
                <SignIn setUser={setUser} isSignIn={isSignIn} setIsSignIn={setIsSignIn}/> :
                <SignUp isSignIn={isSignIn} setIsSignIn={setIsSignIn}/> }
        </div>
    );
}

export default EntryForm;