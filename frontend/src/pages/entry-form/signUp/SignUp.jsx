import { useState } from "react";
import "./signUp.css";
import Loader from "../../../components/loader/Loader";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import { useAuth } from "../../../hooks/useAuth";

import requests from "../../../serverRequests/requests";
const { postUser } = requests.users;
const { postLogin } = requests.auth;

function SignUp({ isSignIn, setIsSignIn }) {
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isDirty, setIsDirty] = useState({
        username: false,
        password: false,
        confirmPassword: false
    });
    const errors = {
        username: [
            { status: (formInput.username.length > 25), message: 'Username cannot be over 25 characters' }, // max length
            { status: (formInput.username.length < 8), message: 'Username must be atleast 8 characters' } // min length
        ],
        email: [],
        password: [
            { status: (formInput.password.length > 25), message: 'Password cannot be over 25 characters' }, // max length
            { status: (formInput.password.length < 8), message: 'Password must be atleast 8 characters' } // min length
        ],
        confirmPassword: [
            { status: (formInput.confirmPassword !== formInput.password), message: 'Password must match'} // matches password
        ]
    };

    function handleClick() { // sign in link
        setIsSignIn(!isSignIn);
    }

    function isValid() {
        for (let field in errors) { 
            for (let error in errors[field]) {
                if (errors[field][error].status) {
                    return false;
                }
            }
        }
        return true;
    }

    function handleChange(e) {
        setIsDirty({
            ...isDirty,
            [e.target.name]: true
        });
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!isValid()) return alert('Form input invalid');
        setIsLoading(true);

        const postUserRes = await postUser({ credentials: formInput });

        if (postUserRes.success) {
            const credentials = { username: postUserRes.user.username, email: formInput.email, password: formInput.password.trim() };
            const postLoginRes = await postLogin(credentials);

            if (postLoginRes.success) {
                await login(postLoginRes);
            }
            setFormInput({
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            });
        } else {
            setResponsePopupData({ message: postUserRes.message, success: postUserRes.success });
            setResponsePopupIsActive(true);
        }
        setIsLoading(false);
    }

    return(
        <main className="entryForm-wrapper">
            <h2>Sign Up</h2>
            <form action="/login" method="POST" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label><br/>
                <input type="text" name="username" id="username" value={formInput.username} onChange={handleChange}/><br/>
                <ul>
                    { errors.username.map((error, i) => 
                        error.status && isDirty.username && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
                <label htmlFor="email">Email <i>optional</i></label><br/>
                <input type="text" name="email" id="email" value={formInput.email} onChange={handleChange}/><br/>
                <ul>
                    { errors.email.map((error, i) => 
                        error.status && isDirty.email && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
                <label htmlFor="password">Password</label><br/>
                <input type="password" name="password" id="password" value={formInput.password} onChange={handleChange}/><br/>
                <ul>
                    { errors.password.map((error, i) => 
                        error.status && isDirty.password && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
                <label htmlFor="confirmPassword">Confirm Password</label><br/>
                <input type="password" name="confirmPassword" id="confirmPassword" value={formInput.confirmPassword} onChange={handleChange}/><br/>
                <ul>
                    { errors.confirmPassword.map((error, i) => 
                        error.status && isDirty.confirmPassword && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
                <button>Submit</button>
                {isLoading && <Loader/>}
            </form>
            <span>Already have an account? </span>
            <span className="link" onClick={handleClick}>Sign In</span>
        </main>
    );
}

export default SignUp;