import { useState, useEffect } from "react";
import "./header.css";
import EditAlbumForm from "./editAlbumForm/EditAlbumForm";
import CreateAlbumForm from "./createAlbumForm/CreateAlbumForm";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import DeleteAlbumForm from "./deleteAlbumForm/DeleteAlbumForm";

import requests from "../../../serverRequests/requests";
const { getAlbums } = requests.albums;
const { getUser } = requests.users;

function Header({ isLoading, setIsLoading, setPhotos, albums, setAlbums, selectedAlbum, setSelectedAlbum }) {
    const [profileUser, setProfileUser] = useState(null);
    const { id, albumId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            try {
                const res = await getUser({ id });

                if (res.success) {
                    setProfileUser(res.user);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [id]);

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
                    <div>
                        { profileUser && <span><Link to={`/users/${profileUser._id}`}>{profileUser.username}</Link>/photo-albums/</span> }
                        <h2>{selectedAlbum.name}</h2>
                        { id === user._id &&
                            selectedAlbum.name !== "Profile Pictures" &&
                            selectedAlbum.name !== "Cover Photos" &&
                            selectedAlbum.name !== "All" &&
                            <div style={{ display: "flex", gap: ".5rem" }}>
                                <EditAlbumForm selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} setAlbums={setAlbums}/>
                                <span>-</span>
                                <DeleteAlbumForm selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} setAlbums={setAlbums}/>
                            </div> }
                    </div>
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
    );
}

export default Header;