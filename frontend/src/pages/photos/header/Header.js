import { useState, useEffect } from "react";
import "./header.css";
import EditAlbumForm from "./editAlbumForm/EditAlbumForm";
import CreateAlbumForm from "./createAlbumForm/CreateAlbumForm";
import { useAuth } from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";

import requests from "../../../serverRequests/methods/config";
import DeleteAlbumForm from "./deleteAlbumForm/DeleteAlbumForm";

const { getAlbums } = requests.albums;

function Header({ isLoading, setIsLoading, setPhotos, albums, setAlbums }) {
    const { id, albumId } = useParams();
    const [selectedAlbum, setSelectedAlbum] = useState({ _id: albumId, name: "", photos: [], desc: "" });
    const { user } = useAuth();


    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const res = await getAlbums({ queryBody: { userId: id } });

                if (res.success) {
                    setAlbums(res.albums);
        
                    const [ album ] = res.albums.filter(album => album._id === albumId);
                    setSelectedAlbum(album);
            
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
        setSelectedAlbum(album);
        setPhotos(album.photos);
    }

    return(
        <header>
            { isLoading ?
                <div className="album-name_loader loadingBGColor"/> :
                <div className="flexbox-left">
                    <h2>{selectedAlbum.name}</h2>
                    { id === user._id &&
                        selectedAlbum.name !== "Profile Pictures" &&
                        selectedAlbum.name !== "Cover Photos" &&
                        selectedAlbum.name !== "All" &&
                        <>
                            <EditAlbumForm selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} setAlbums={setAlbums}/>
                            <span>/</span>
                            <DeleteAlbumForm selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} setAlbums={setAlbums}/>
                        </> }
                </div> }
            <div className="flexbox-right">
                <label htmlFor="select-album" className="hide">Select Album</label>
                <select name="select-album" id="select-album" value={selectedAlbum._id} onChange={handleChange}>
                    { albums.map(album => 
                        <option key={album._id} value={album._id}>{album.name}</option>) }
                </select>
                { id === user._id && <CreateAlbumForm setAlbums={setAlbums}/> }
            </div>
        </header>
    )
}

export default Header;