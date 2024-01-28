import { useState } from "react";
import "./home.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import axios from "axios";

function Home({ user, setUser }) {
    const [formInput, setFormInput] = useState({ username: "", password: "" });

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    function handleChange(e) {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const requestBody = {};
        let isEdited = false;
        for (const key in formInput) {
            if (formInput[key] !== "") {
                requestBody[key] = formInput[key];
                isEdited = true;
            }
        }
        isEdited && updateUser(requestBody)
            .then(data => {
                const { user } = data;
                setUser(user);
                setFormInput({ username: "", password: "" });
            })
            .catch(err => console.log(err));
    }

    async function updateUser(input) {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        };
        const res = await axios.put(`/users/${user._id}`,
            input,
            config);
        return res.data;
    }

    return(
        <>
            <header>
                <Navbar/>
                <div 
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 1rem"
                }}>
                    <h1>Hello {user.username}</h1>
                    <span 
                        onClick={logout}
                        style={{
                            color: "dodgerblue",
                            cursor: "pointer"
                    }}>
                        Logout
                    </span>
                </div>
            </header>
            <main style={{padding: "1rem"}}>
                <h2>Main Content</h2>
                <section>
                    <form onSubmit={handleSubmit} action={`/users/${user._id}`} method="PUT">
                        <label htmlFor="username">Edit Username</label><br/>
                        <input type="text" name="username" id="username" value={formInput.username} onChange={handleChange}/><br/>
                        <label htmlFor="username">Edit Password</label><br/>
                        <input type="text" name="password" id="password" value={formInput.password} onChange={handleChange}/><br/>
                        <button>Submit</button>
                    </form>
                </section>
            </main>
            <Footer/>
        </>
    );
}

export default Home;