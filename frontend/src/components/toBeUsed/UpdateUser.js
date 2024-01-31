import { useState } from "react";
import "./home.css";
import axios from "axios";

function UpdateUser({ user, setUser }) {
    const [formInput, setFormInput] = useState({ username: "", password: "" });

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
        <section>
            <form onSubmit={handleSubmit} action={`/users/${user._id}`} method="PUT">
                <label htmlFor="username">Edit Username</label><br/>
                <input type="text" name="username" id="username" value={formInput.username} onChange={handleChange}/><br/>
                <label htmlFor="username">Edit Password</label><br/>
                <input type="text" name="password" id="password" value={formInput.password} onChange={handleChange}/><br/>
                <button>Submit</button>
            </form>
        </section>
    );
}

export default UpdateUser;