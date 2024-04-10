import { useState } from "react";
import "./createAlbumForm.css";
import { useAuth } from "../../../../hooks/useAuth";

import requests from "../../../../serverRequests/methods/config";
const { postAlbum } = requests.albums;

function CreateAlbumForm({ setAlbums }) {
    const [isActive, setIsActive] = useState(false);
    const [formInput, setFormInput] = useState({
        name: "",
        desc: ""
    });
    const { user, token } = useAuth();

    function handleChange(e) {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            const reqBody = {
                token,
                album: {
                    user: user._id,
                    name: formInput.name,
                    desc: formInput.desc
                }
            }
            const res = await postAlbum(reqBody);
    
            if (res.success) {
                setAlbums(albums => [...albums, res.album]);
                setFormInput({
                    name: "",
                    desc: ""
                });
                setIsActive(false);
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    return(
        <div className="create-album-form">
            <button onClick={() => setIsActive(true)}>
                <div className="bar vertical"/>
                <div className="bar horizontal"/>
            </button>
            <div className={ isActive ? "form-popup_mask active" : "form-popup_mask" }>
                <div className="form-popup">
                    <button onClick={() => setIsActive(false)}>
                        <div className="bar vertical"/>
                        <div className="bar horizontal"/>
                    </button>
                    <form onSubmit={handleSubmit}>
                        <h3>Create Album</h3>
                        <label htmlFor="name">Name</label><br/>
                        <input
                            name="name"
                            id="name"
                            value={formInput.name}
                            onChange={handleChange}
                            required={true}
                            maxLength={25}
                            minLength={3}
                        /><br/>
                        <label htmlFor="desc">Desc</label><br/>
                        <textarea name="desc" id="desc" value={formInput.desc} onChange={handleChange} maxLength={250}/><br/>
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAlbumForm;