import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import { useAuth } from "../../../hooks/useAuth";
import requests from "../../../serverRequests/methods/config";
const { postUser } = requests.users;
const { postLogin } = requests.auth;

function SignUp({ isSignIn, setIsSignIn }) {
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { login } = useAuth();
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

    async function handleSubmit(e) {
        e.preventDefault();
        if (!isValid()) return alert('Form input invalid');
        setIsLoading(true);

        const postUserRes = await postUser({ credentials: formInput });

        if (postUserRes.success) {
            const credentials = { username: postUserRes.user.username, password: formInput.password.trim() };
            const postLoginRes = await postLogin(credentials);

            if (postLoginRes.success) {
                await login(postLoginRes);
            }
            setFormInput({
                username: "",
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