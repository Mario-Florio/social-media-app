import { useState } from "react";
import "./form.css";
import Loader from "../../../../components/loader/Loader";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useAuth } from "../../../../hooks/useAuth";
import requests from "../../../../serverRequests/methods/config";

const { putProfile } = requests.users;

function ProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { user, updateUser, token } = useAuth();
    const [formInput, setFormInput] = useState({ bio: user.profile.bio });

    function handleChange(e) {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            setIsLoading(true);
    
            const requestBody = { id: user._id, update: {}, token };
            let isEdited = false;
            for (const key in formInput) {
                if (formInput[key] !== "") {
                    if (user.profile[key] !== formInput[key]) {
                        requestBody.update[key] = formInput[key];
                        isEdited = true;
                    }
                }
            }
            
            if (isEdited) {
                const res = await putProfile(requestBody);

                if (res.success) {
                    const user = res.user;
                    updateUser(user);
                    setFormInput({ bio: user.profile.bio });
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

    return(
        <form className="profile-form" onSubmit={handleSubmit} action={`/users/${user._id}`} method="PUT">
            <h3 style={{ fontWeight: "300", color: "var(--secondary-font-color)", borderBottom: ".5px solid var(--secondary-font-color)" }}>Profile</h3>
            <div className="form-field">
                <label htmlFor="bio">Bio</label>
                <textarea name="bio" id="bio" value={formInput.bio} onChange={handleChange}/>
            </div>
            <button disabled={isLoading} onClick={handleSubmit}>
                { isLoading ? <Loader color="var(--secondary-color" secondaryColor="white" size={15}/> :
                "Submit" }</button>
        </form>
    );
}

export default ProfileForm;