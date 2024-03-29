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

    function handleSubmit() {
        if (!isValid()) {
            console.log(errors);
            return alert('Form input invalid')
        };
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
            <button onClick={handleSubmit}>Submit</button>
            <button className="delete-button" onClick={handleDelete}>Delete Account</button>
        </form>
    );
}

export default AccountForm;