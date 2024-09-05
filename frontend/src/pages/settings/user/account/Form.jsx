import { useState } from "react";
import "./form.css";
import Loader from "../../../../components/loader/Loader";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useAuth } from "../../../../hooks/useAuth";

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
            maxLength: { status: (passwordIsActive && formInput.password.length > 25), message: 'Password cannot be over 25 characters' },
            minLength: { status: (passwordIsActive && formInput.password.length < 8), message: 'Password must be atleast 8 characters' }
        },
        confirmPassword: {
            isMatch: { status: (formInput.confirmPassword !== formInput.password), message: 'Password must match'}
        }
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
            if (!isValid()) return alert('Form input invalid');
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
                    setFormInput({ username: user.username, password: "", confirmPassword: "" });
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
                <div className="err-container">
                    {errors.username.minLength.status && isDirty.username && <><span className="err-msg">{errors.username.minLength.message}</span><br/></>}
                    {errors.username.maxLength.status && isDirty.username && <><span className="err-msg">{errors.username.maxLength.message}</span><br/></>}
                </div>
            </div>
            <div className="form-field">
                <label htmlFor="password">Password</label>
                <input type="text" name="password" id="password" value={formInput.password} onChange={handleChange}/>
                <div className="err-container">
                    {errors.password.minLength.status && isDirty.password && <><span className="err-msg">{errors.password.minLength.message}</span><br/></>}
                    {errors.password.maxLength.status && isDirty.password && <><span className="err-msg">{errors.password.maxLength.message}</span><br/></>}
                </div>
            </div>
            { passwordIsActive && <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="text" name="confirmPassword" id="confirmPassword" value={formInput.confirmPassword} onChange={handleChange}/>
                <div className="err-container">
                    {errors.confirmPassword.isMatch.status && isDirty.confirmPassword && <><span className="err-msg">{errors.confirmPassword.isMatch.message}</span><br/></>}
                </div>
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