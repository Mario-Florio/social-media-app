import "./form.css";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import requests from "../../../serverRequests/methods/config";

const { putUser } = requests.users;

function UserForm() {
    const { user, updateUser, token } = useAuth();
    const [passwordIsActive, setPasswordIsActive] = useState(false);
    const [formInput, setFormInput] = useState({
        username: user.username,
        password: "",
        confirmPassword: ""
    });

    function handleChange(e) {
        if (e.target.name === "password" && e.target.value.length > 0) {
            setPasswordIsActive(true)
        } else if (e.target.name === "password") {
            setPasswordIsActive(false);
        }
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const reqBody = { id: user._id, update: {}, token };
        let isEdited = false;
        for (const key in formInput) {
            if (formInput[key] !== "" && key !== "confirmPassword") {
                reqBody.update[key] = formInput[key];
                isEdited = true;
            }
        }
        isEdited && putUser(reqBody)
            .then(data => {
                const { user } = data;
                updateUser(user);
                setFormInput({ username: user.username, password: "", confirmPassword: "" });
            })
            .catch(err => console.log(err));
    }

    return(
        <form className="user-form" onSubmit={handleSubmit} action={`/users/${user._id}`} method="PUT">
            <div className="form-field">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={formInput.username} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="password">Password</label>
                <input type="text" name="password" id="password" value={formInput.password} onChange={handleChange}/>
            </div>
            { passwordIsActive && <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="text" name="confirmPassword" id="confirmPassword" value={formInput.confirmPassword} onChange={handleChange}/>
            </div> }
            <button>Submit</button>
        </form>
    );
}

export default UserForm;