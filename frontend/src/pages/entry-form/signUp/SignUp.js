import { useState } from "react";
import Loader from "../../../components/loader/Loader";

import requests from "../../../serverRequests/methods/config";
const { postUser } = requests.users;

function SignUp({ isSignIn, setIsSignIn }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [isDirty, setIsDirty] = useState({
        username: false,
        password: false,
        confirmPassword: false
    });
    const errors = {
        username: {
            maxLength: { status: (formInput.username.length > 25), message: 'Username cannot be over 25 characters' },
            minLength: { status: (formInput.username.length < 8), message: 'Username must be atleast 8 characters' }
        },
        password: {
            maxLength: { status: (formInput.password.length > 25), message: 'Password cannot be over 25 characters' },
            minLength: { status: (formInput.password.length < 8), message: 'Password must be atleast 8 characters' }
        },
        confirmPassword: {
            isMatch: { status: (formInput.confirmPassword !== formInput.password), message: 'Password must match'}
        }
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

    function handleSubmit(e) {
        e.preventDefault();
        if (!isValid()) return alert('Form input invalid');
        setIsLoading(true);
        postUser({ credentials: formInput })
            .then(data => {
                setIsLoading(false);
                if (data.success) {
                    setIsSignIn(true);
                    setFormInput({
                        username: "",
                        password: "",
                        confirmPassword: ""
                    });
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    }

    return(
        <main className="entryForm-wrapper">
            <h2>Sign Up</h2>
            <form action="/login" method="POST" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label><br/>
                <input type="text" name="username" id="username" value={formInput.username} onChange={handleChange}/><br/>
                {errors.username.minLength.status && isDirty.username && <><span className="err-msg">{errors.username.minLength.message}</span><br/></>}
                {errors.username.maxLength.status && isDirty.username && <><span className="err-msg">{errors.username.maxLength.message}</span><br/></>}
                <label htmlFor="password">Password</label><br/>
                <input type="text" name="password" id="password" value={formInput.password} onChange={handleChange}/><br/>
                {errors.password.minLength.status && isDirty.password && <><span className="err-msg">{errors.password.minLength.message}</span><br/></>}
                {errors.password.maxLength.status && isDirty.password && <><span className="err-msg">{errors.password.maxLength.message}</span><br/></>}
                <label htmlFor="confirmPassword">Confirm Password</label><br/>
                <input type="text" name="confirmPassword" id="confirmPassword" value={formInput.confirmPassword} onChange={handleChange}/><br/>
                {errors.confirmPassword.isMatch.status && isDirty.confirmPassword && <><span className="err-msg">{errors.confirmPassword.isMatch.message}</span><br/></>}
                <button>Submit</button>
                {isLoading && <Loader/>}
            </form>
            <span>Already have an account? </span>
            <span className="link" onClick={handleClick}>Sign In</span>
        </main>
    );
}

export default SignUp;