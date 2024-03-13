import "./form.css";
import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import requests from "../../../../serverRequests/methods/config";

const { putProfile } = requests.users;

function ProfileForm() {
    const { user, updateUser, token } = useAuth();
    const [formInput, setFormInput] = useState({ bio: user.profile.bio });

    function handleChange(e) {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const requestBody = { id: user._id, update: {}, token };
        let isEdited = false;
        for (const key in formInput) {
            if (formInput[key] !== "") {
                requestBody.update[key] = formInput[key];
                isEdited = true;
            }
        }
        isEdited && putProfile(requestBody)
            .then(data => {
                const { user } = data;
                updateUser(user);
                setFormInput({ bio: user.profile.bio });
            })
            .catch(err => console.log(err));
    }

    return(
        <form className="profile-form" onSubmit={handleSubmit} action={`/users/${user._id}`} method="PUT">
            <h3 style={{ fontWeight: "300", color: "var(--secondary-font-color)", borderBottom: ".5px solid var(--secondary-font-color)" }}>Profile</h3>
            <div className="form-field">
                <label htmlFor="bio">Bio</label>
                <input type="text" name="bio" id="bio" value={formInput.bio} onChange={handleChange}/>
            </div>
            <button>Submit</button>
        </form>
    );
}

export default ProfileForm;