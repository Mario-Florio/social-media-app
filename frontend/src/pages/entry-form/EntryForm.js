import { useState } from "react";
import SignIn from "./signIn/SignIn";
import SignUp from "./signUp/SignUp";

function EntryForm({ setUser }) {
    const [isSignIn, setIsSignIn] = useState(true);

    return(isSignIn ?
        <SignIn setUser={setUser} isSignIn={isSignIn} setIsSignIn={setIsSignIn}/> :
        <SignUp isSignIn={isSignIn} setIsSignIn={setIsSignIn}/>
    );
}

export default EntryForm;