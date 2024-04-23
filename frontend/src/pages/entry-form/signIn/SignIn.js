import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import { useAuth } from "../../../hooks/useAuth";

import requests from "../../../serverRequests/methods/config";
const { postLogin } = requests.auth;

function SignIn({ isSignIn, setIsSignIn }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        username: "",
        password: "",
    });
    const { login } = useAuth();
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

    function handleClick() {
        setIsSignIn(!isSignIn);
    }

    function handleChange(e) {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        postLogin(formInput)
            .then(async data => {
                setIsLoading(false);
                if (data.success) {
                    await login(data);
                    setFormInput({
                        username: "",
                        password: ""
                    });
                } else {
                    setResponsePopupData({ message: data.message, success: data.success });
                    setResponsePopupIsActive(true);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    }

    return(
        <main className="entryForm-wrapper">
            <h2>Sign In</h2>
            <form action="/login" method="POST" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label><br/>
                <input type="text" name="username" id="username" value={formInput.username} onChange={handleChange} required/><br/>
                <label htmlFor="password">Password</label><br/>
                <input type="text" name="password" id="password" value={formInput.password} onChange={handleChange} required/><br/>
                <button>Submit</button>
                {isLoading && <Loader/>}
            </form>
            <span>Dont have an account? </span>
            <span className="link" onClick={handleClick}>Sign Up</span>
        </main>
    );
}

export default SignIn;