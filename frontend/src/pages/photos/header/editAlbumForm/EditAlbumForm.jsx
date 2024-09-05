import { useEffect, useState } from "react";
import "./editAlbumForm.css";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useAuth } from "../../../../hooks/useAuth";

import requests from "../../../../serverRequests/requests";
const { putAlbum } = requests.albums;

function EditAlbumForm({ selectedAlbum, setSelectedAlbum, setAlbums }) {
    const [isActive, setIsActive] = useState(false);
    const [formInput, setFormInput] = useState({
        name: "",
        desc: ""
    });
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { token } = useAuth();

    useEffect(() => {
        setFormInput({
            name: selectedAlbum.name,
            desc: selectedAlbum.desc
        });
    }, [selectedAlbum]);

    function handleChange(e) {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (formInput.name === selectedAlbum.name && formInput.desc === selectedAlbum.desc) {
            setResponsePopupData({ message: "Request Failed: You must edit album", success: false });
            setResponsePopupIsActive(true);
            return;
        }

        const reqBody = {
            token,
            id: selectedAlbum._id,
            update: formInput
        }

        const res = await putAlbum(reqBody);
        if (res.success) {
            setSelectedAlbum(res.album);
            setAlbums(albums => albums.map(album => album._id === res.album._id ? res.album : album));
        }

        setResponsePopupData({ message: res.message, success: res.success });
        setResponsePopupIsActive(true);
        setIsActive(false);
    }

    return(
        <section className="edit-album-form">
            <span onClick={() => setIsActive(true)}>Edit</span>
            <div className={ isActive ? "form-popup_mask active" : "form-popup_mask" }>
                <div className="form-popup">
                    <button onClick={() => setIsActive(false)}>
                        <div className="bar vertical"/>
                        <div className="bar horizontal"/>
                    </button>
                    <form onSubmit={handleSubmit}>
                        <h3>Edit Album</h3>
                        <label htmlFor="name">Name</label><br/>
                        <input
                            name="name"
                            id="name"
                            value={formInput.name}
                            onChange={handleChange}
                            required={true}
                            minLength={3}
                            maxLength={25}
                        /><br/>
                        <label htmlFor="desc">Desc</label><br/>
                        <textarea
                            name="desc"
                            id="desc"
                            value={formInput.desc}
                            onChange={handleChange}
                            maxLength={250}
                        /><br/>
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default EditAlbumForm;