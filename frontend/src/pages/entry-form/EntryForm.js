import { useState } from "react";
import { Navigate } from "react-router-dom";
import SignIn from "./signIn/SignIn";
import SignUp from "./signUp/SignUp";

import { useAuth } from "../../hooks/useAuth";

function EntryForm({ setUser }) {
    const [isSignIn, setIsSignIn] = useState(true);

    const { user } = useAuth();

    if (user) {
        return <Navigate to="/" />;
    }

    return(isSignIn ?
        <SignIn setUser={setUser} isSignIn={isSignIn} setIsSignIn={setIsSignIn}/> :
        <SignUp isSignIn={isSignIn} setIsSignIn={setIsSignIn}/>
    );
}

export default EntryForm;