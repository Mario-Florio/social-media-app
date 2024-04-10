import { useState, useEffect } from "react";
import "./header.css";
import CreateAlbumForm from "./createAlbumForm/CreateAlbumForm";
import { useAuth } from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";

import requests from "../../../serverRequests/methods/config";

const { getAlbums } = requests.albums;

function Header({ isLoading, setIsLoading, setPhotos }) {
    const { id, albumId } = useParams();
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState({ id: albumId, name: "" });
    const { user } = useAuth();

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const res = await getAlbums({ queryBody: { userId: id } });

                if (res.success) {
                    setAlbums(res.albums);
        
                    const [ album ] = res.albums.filter(album => album._id === albumId);
                    setSelectedAlbum({ id: album._id, name: album.name });
            
                    setPhotos(album.photos);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [id, albumId]);

    function handleChange(e) {
        const [ album ] = albums.filter(album => album._id === e.target.value);
        setSelectedAlbum({ id: e.target.value, name: album.name });
        setPhotos(album.photos);
    }

    return(
        <header>
            { isLoading ?
                <div className="album-name_loader loadingBGColor"/> :
                <h2 onClick={() => console.log("hi")}>{selectedAlbum.name}</h2> }
            <div className="flexbox">
                <label htmlFor="select-album" className="hide">Select Album</label>
                <select name="select-album" id="select-album" value={selectedAlbum.id} onChange={handleChange}>
                    { albums.map(album => 
                        <option
                            key={album._id}
                            value={album._id}
                        >
                            {album.name}
                        </option>) }
                </select>
                { id === user._id && <CreateAlbumForm setAlbums={setAlbums}/> }
            </div>
        </header>
    )
}

export default Header;