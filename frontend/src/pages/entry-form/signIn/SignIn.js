import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

function SignIn({ isSignIn, setIsSignIn }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        username: "",
        password: "",
    });
    const { login } = useAuth();

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
        getUser(formInput)
            .then(async data => {
                setIsLoading(false);
                if (data.user) {
                    await login(data);
                    setFormInput({
                        username: "",
                        password: ""
                    });
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    }

    async function getUser(credentials) {
        const { username, password } = credentials;
        try {
            const res = await axios.post("/auth/login", {
                username,
                password
            });
            const user = res.data;
            return user;
        } catch(err) {
            console.log(err);
        }
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