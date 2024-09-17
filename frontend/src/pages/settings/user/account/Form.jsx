import { useState } from "react";
import "./form.css";
import isNotValidEmail from "../../../__utils__/isNotValidEmail";
import { useAuth } from "../../../../hooks/useAuth";
import Loader from "../../../../components/loader/Loader";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";

import requests from "../../../../serverRequests/requests";
const { putUser, deleteUser } = requests.users;

function AccountForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDeletePopupIsActive, setConfirmDeletePopupIsActive] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { user, updateUser, token, logout } = useAuth();
    const [passwordIsActive, setPasswordIsActive] = useState(false);
    const [formInput, setFormInput] = useState({
        username: user.username,
        email: user.email || "",
        password: "",
        confirmPassword: ""
    });
    const [isDirty, setIsDirty] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    const errors = {
        username: [
            { status: (formInput.username.length > 25), message: 'Username cannot be over 25 characters' }, // max length
            { status: (formInput.username.length < 8), message: 'Username must be atleast 8 characters' } // min length
        ],
        email: [
            { status: isNotValidEmail(formInput.email) && formInput.email.length > 0, message: "Email must be in valid format" }
        ],
        password: [
            { status: (passwordIsActive && formInput.password.length > 25), message: 'Password cannot be over 25 characters' }, // max length
            { status: (passwordIsActive && formInput.password.length < 8), message: 'Password must be atleast 8 characters' } // min length
        ],
        confirmPassword: [
            { status: (formInput.confirmPassword !== formInput.password), message: 'Password must match'} // matches password
        ]
    };

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
        if (e.target.name === "password" && e.target.value.length > 0) {
            setPasswordIsActive(true)
        } else if (e.target.name === "password") {
            setPasswordIsActive(false);
        }
        setIsDirty({
            ...isDirty,
            [e.target.name]: true
        });
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit() {
        try {
            if (!isValid()) {
                setResponsePopupData({ message: "Invalid form input", success: false });
                setResponsePopupIsActive(true);
                return;
            }
            setIsLoading(true);
    
            const reqBody = { id: user._id, update: {}, token };
            let isEdited = false;
            for (const key in formInput) {
                if (formInput[key] !== "" && key !== "confirmPassword") {
                    if (user[key] !== formInput[key]) {
                        reqBody.update[key] = formInput[key];
                        isEdited = true;
                    }
                }
            }
            
            if (isEdited) {
                const res = await putUser(reqBody);

                if (res.success) {
                    const user = res.user;
                    updateUser(user);
                    setFormInput({ username: user.username, email: user.email, password: "", confirmPassword: "" });
                }

                setResponsePopupData({ message: res.message, success: res.success });
                setResponsePopupIsActive(true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        const res = await deleteUser({ id: user._id, token });

        if (res.success) {
            await logout();
        } else {
            console.log(res.message);
        }
    }

    return(
        <form className="account-form" onSubmit={(e) => e.preventDefault()} action={`/users/${user._id}`} method="PUT">
            <h3 style={{ fontWeight: "300", color: "var(--secondary-font-color)", borderBottom: ".5px solid var(--secondary-font-color)" }}>Account</h3>
            <div className="form-field">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={formInput.username} onChange={handleChange}/>
                <ul className="err-container">
                    { errors.username.map((error, i) => 
                        error.status && isDirty.username && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
            </div>
            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" id="email" value={formInput.email} onChange={handleChange}/>
                <ul className="err-container">
                    { errors.email.map((error, i) => 
                        error.status && isDirty.email && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
            </div>
            <div className="form-field">
                <label htmlFor="password">Password</label>
                <input type="text" name="password" id="password" value={formInput.password} onChange={handleChange}/>
                <ul className="err-container">
                    { errors.password.map((error, i) => 
                        error.status && isDirty.password && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
            </div>
            { passwordIsActive && <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="text" name="confirmPassword" id="confirmPassword" value={formInput.confirmPassword} onChange={handleChange}/>
                <ul className="err-container">
                    { errors.confirmPassword.map((error, i) => 
                        error.status && isDirty.confirmPassword && <li key={i}><span className="err-msg">{error.message}</span></li>) }
                </ul>
            </div> }
            <div className="buttons_wrapper">
                <button disabled={isLoading} onClick={handleSubmit}>
                    { isLoading ? <Loader color="var(--secondary-color)" secondaryColor="white" size={15}/> :
                    "Submit" }</button>
                <button className="delete-button" onClick={() => setConfirmDeletePopupIsActive(true)}>Delete Account</button>
            </div>
            <div className={confirmDeletePopupIsActive ? "popup_mask active" : "popup_mask"}>
                <div className="confirm-delete_popup">
                    <p>Are you sure you want to delete your account?</p>
                    <button className="delete-button" disabled={isLoading} onClick={async () => await handleDelete()}>Confirm</button>
                    <button disabled={isLoading} onClick={() => setConfirmDeletePopupIsActive(false)}>Cancel</button>
                </div>
            </div>
        </form>
    );
}

export default AccountForm;