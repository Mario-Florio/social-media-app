import { useEffect, useState } from "react";
import "./photos.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import requests from "../../serverRequests/methods/config";

const { getAlbums } = requests.albums;

function PhotosPage() {
    const { id, albumId } = useParams();
    const { user } = useAuth();
    const [photos, setPhotos] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState({ id: albumId, name: "" });
    const [isLoading, setIsLoading] = useState(false);
    const loaders = [1, 2, 3, 4, 5, 6, 7, 8 ,9];

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
        <PageLayout>
            <section id="photos" className="main-component">
                <header>
                    { isLoading ?
                        <div className="album-name_loader loadingBGColor"/> :
                        <h2>{selectedAlbum.name}</h2> }
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
                        { id === user._id && <button>+</button> }
                    </div>
                </header>
                <ul>
                    { isLoading ?
                        loaders.map(num => <LoaderPhoto key={num}/>) :
                        photos.map(photo => <Photo key={photo._id} data={photo}/>) }
                </ul>
            </section>
        </PageLayout>
    );
}

export default PhotosPage;

function LoaderPhoto() {
    return(
        <li>
            <div className="img_wrapper loadingBGColor" />
        </li>
    );
}

function Photo({ data }) {
    const [maskIsActive, setMaskIsActive] = useState(false);
    return(
        <li
            onMouseEnter={() => setMaskIsActive(true)}
            onMouseLeave={() => setMaskIsActive(false)}
        >
            <div className="img_wrapper">
                <img src={data.url} alt={data.name}/>
            </div>
            <div className={maskIsActive ? "photo_mask active" : "photo_mask"}>
                <h3>{data.name}</h3>
                <div className="caption_wrapper">
                    <p>{data.caption}</p>
                </div>
            </div>
        </li>
    );
}
