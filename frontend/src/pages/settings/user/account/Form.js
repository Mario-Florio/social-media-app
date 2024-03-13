import "./form.css";
import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import requests from "../../../../serverRequests/methods/config";

const { putUser } = requests.users;

function AccountForm() {
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

    function handleSubmit() {
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

    function handleDelete() {
        console.log("Not setup");
    }

    return(
        <form className="account-form" onSubmit={(e) => e.preventDefault()} action={`/users/${user._id}`} method="PUT">
            <h3 style={{ fontWeight: "300", color: "var(--secondary-font-color)", borderBottom: ".5px solid var(--secondary-font-color)" }}>Account</h3>
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
            <button onSubmit={handleSubmit}>Submit</button>
            <button className="delete-button" onClick={handleDelete}>Delete Account</button>
        </form>
    );
}

export default AccountForm;