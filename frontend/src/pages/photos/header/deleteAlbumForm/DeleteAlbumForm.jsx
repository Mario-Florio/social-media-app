import { useState } from "react";
import "./deleteAlbumForm.css";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useAuth } from "../../../../hooks/useAuth";

import requests from "../../../../serverRequests/requests";
const { deleteAlbum } = requests.albums;

function DeleteAlbumForm({ selectedAlbum, setSelectedAlbum, setAlbums }) {
    const [isActive, setIsActive] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { token } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        const reqBody = {
            token,
            id: selectedAlbum._id
        }

        const res = await deleteAlbum(reqBody);

        if (res.success) {
            let albums = [];
            setAlbums(prevState => {
                albums = prevState;
                return prevState.filter(album => album._id !== selectedAlbum._id);
            });
            setSelectedAlbum(albums[0]);
            setIsActive(false);
        }

        setResponsePopupData({ message: res.message, success: res.success });
        setResponsePopupIsActive(true);
    }

    return(
        <section className="delete-album-form">
            <span onClick={() => setIsActive(true)}>Delete</span>
            <div className={ isActive ? "form-popup_mask active" : "form-popup_mask" }>
                <div className="form-popup">
                    <button onClick={() => setIsActive(false)}>
                        <div className="bar vertical"/>
                        <div className="bar horizontal"/>
                    </button>
                    <form onSubmit={handleSubmit}>
                        <h3>Delete Album</h3>
                        <p>Are you sure you want to delete "{selectedAlbum.name}"?</p>
                        <div className="buttons-flexbox">
                            <button className="warningBGColor">Confirm</button>
                            <button onClick={() => setIsActive(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default DeleteAlbumForm;