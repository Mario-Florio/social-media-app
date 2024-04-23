import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import "./uploadForm.css";

import requests from "../../../serverRequests/methods/config";

const { postPhotos } = requests.albums;

function UploadForm({ albums, setAlbums, setPhotos, selectedAlbum, userId }) {
    const [isActive, setIsActive] = useState(false);
    const [albumId, setAlbumId] = useState(albums[0]._id);
    const { token } = useAuth();

    function handleChange(e) {
        setAlbumId(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const reqBody = {
            albumId,
            formData,
            token
        }
        const res = await postPhotos(reqBody);
        if (res.success) {
            if (albumId === selectedAlbum._id) setPhotos(prevState => [...prevState, res.photo]);

            const [ album ] = albums.filter(album => album._id === albumId);
            if (album.name === "All") {
                const updatedAlbums = [];
                for (const album of albums) {
                    const albumClone = {};
                    for (const key in album) {
                        if (key === "photos") {
                            albumClone[key] = [...album[key]];
                            albumClone[key].push(res.photo);
                        } else {
                            albumClone[key] = album[key];
                        }
                    }
                    updatedAlbums.push(albumClone);
                }
                setAlbums(updatedAlbums);
                
            } else {
                const updatedAlbums = [];
                for (const album of albums) {
                    if (album._id === albumId) {
                        const albumClone = {};
                        for (const key in album) {
                            if (key === "photos") {
                                albumClone[key] = [...album[key]];
                                albumClone[key].push(res.photo);
                            } else {
                                albumClone[key] = album[key];
                            }
                        }
                        updatedAlbums.push(albumClone);
                    } else {
                        updatedAlbums.push(album);
                    }
                }
                setAlbums(updatedAlbums);
            }

            e.target.reset();
            setAlbumId(albums[0]._id);
            setIsActive(false);
        }
    }

    return(
        <div className={ isActive ? "photo-upload-form_wrapper active" : "photo-upload-form_wrapper inactive" }>
            <button onClick={() => setIsActive(!isActive)}>
                <div className="bar vertical"/>
                <div className="bar horizontal"/>
            </button>
            { isActive && <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h3>Upload Photo</h3>
                <label>Album</label><br/>
                <select value={albumId} onChange={handleChange}>
                    { albums.map(album => <option key={album._id} value={album._id}>{album.name}</option>) }
                </select><br/>
                <label htmlFor="name">Name</label><br/>
                <input name="name" id="name" maxLength={25}/><br/>
                <label htmlFor="image">Img File</label><br/>
                <input type="file" name="image" id="image" accept="image/*" required={true}/><br/>
                <label htmlFor="caption">Caption</label><br/>
                <textarea name="caption" id="caption" maxLength={250}/><br/>
                <label htmlFor="user" className="hide">User Id</label>
                <input name="user" id="user" className="hide" value={userId} required readOnly/>
                <button>Upload</button>
            </form> }
        </div>
    );
}

export default UploadForm;