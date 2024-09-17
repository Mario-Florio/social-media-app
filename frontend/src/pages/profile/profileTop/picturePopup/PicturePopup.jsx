import { useState } from "react";
import "./picturePopup.css";
import { useAuth } from "../../../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

import requests from "../../../../serverRequests/requests";
const { putProfileDefaultImg } = requests.users;

function PicturePopup({ name, setIsActive, setPicture, options }) {
    function handelCancel() {
        setIsActive(false);
    }

    return(
        <div className="popup_mask">
            <article className="popup">
                <UploadForm
                    setPicture={setPicture}
                    setIsActive={setIsActive}
                    name={name}
                />
                <SelectForm
                    setPicture={setPicture}
                    setIsActive={setIsActive}
                    name={name}
                    options={options}
                />
                <button onClick={handelCancel}>Cancel</button>
            </article>
        </div>
    );
}

export default PicturePopup;

function UploadForm({ setPicture, setIsActive, name }) {
    const [input, setInput] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        input && setPicture(input);
        setIsActive(false);
    }

    function handleChange(e) {
        setInput(URL.createObjectURL(e.target.files[0]));
    }

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor={name}>{ name === "picture" ? "Profile Picture" : "Cover Photo" }</label>
            <input
                type="file"
                name={name}
                id={name}
                accept="image/*"
                onChange={handleChange}
            />
            <button>Upload</button>
        </form>
    );
}

function SelectForm({ setIsActive, name, options }) {
    const [input, setInput] = useState(options[0].value);
    const { user, updateUser, token } = useAuth();
    const { setProfileUser } = useProfile();

    const [ img ] = options.filter(option => option.value === input);
    const imgSrc = img.url;

    async function handleSubmit(e) {
        try {
            e.preventDefault();
    
            const requestBody = { id: user._id, update: { [name]: input }, token };
            
            const res = await putProfileDefaultImg(requestBody);

            if (res.success) {
                const user = res.user;
                setProfileUser(res.user);
                updateUser(user);
                setInput(options[0].value);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsActive(false);
        }
    }

    function handleChange(e) {
        setInput(e.target.value);
    }

    return(
        <form onSubmit={handleSubmit} style={{ margin: ".5rem 0" }}>
            <label htmlFor={name}>Default Pictures</label>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <select name={name} value={input} onChange={handleChange}>
                    { options.map((option) => 
                        <option key={option.value} value={option.value}>{option.name}</option>) }
                </select>
                <div style={{ height: "25px", width: "25px" }}>
                    <img src={imgSrc} alt="selected pic" style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "5px" }}/>
                </div>
            </div>
            <button>Select</button>
        </form>
    );
}