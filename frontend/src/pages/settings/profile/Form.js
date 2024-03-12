import "./form.css";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

async function putUser(reqBody) {
    return { user: { profile: reqBody } };
}

function ProfileForm() {
    const { user, updateUser } = useAuth();
    const { profile } = user;
    const [formInput, setFormInput] = useState({ bio: user.profile.bio });

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
        isEdited && putUser(requestBody)
            .then(data => {
                const { user } = data;
                // updateUser(user);
                console.log(user.profile);
                setFormInput({ bio: user.profile.bio });
            })
            .catch(err => console.log(err));
    }

    return(
        <form className="user-form" onSubmit={handleSubmit} action={`/users/${user._id}`} method="PUT">
            <div className="form-field">
                <label htmlFor="bio">Bio</label>
                <input type="text" name="bio" id="bio" value={formInput.bio} onChange={handleChange}/>
            </div>
            <button>Submit</button>
        </form>
    );
}

export default ProfileForm;