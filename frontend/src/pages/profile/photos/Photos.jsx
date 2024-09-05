import { useEffect, useState } from "react";
import "./photos.css";
import { Link } from "react-router-dom";
import ImgHandler from "../../../components/imgHandler/ImgHandler";
import photoExists from "../../../components/imgHandler/__utils__/photoExists";
import { useParams } from "react-router-dom";

import requests from "../../../serverRequests/requests";
const { getAlbums } = requests.albums;

function Photos() {
    const { id } = useParams();
    const [albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const loaders = [1, 2, 3];

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const res = await getAlbums({ queryBody: { userId: id } });

                if (res.success) {
                    setAlbums(res.albums);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [id]);

    return(
        <section className="photos">
            <h3>Albums</h3>
            <ul>
                { isLoading ?
                    loaders.map(num => <li key={num}><LoaderLink/></li>) :
                    albums.map(album => <li key={album._id}><AlbumLink album={album}/></li>) }
            </ul>
        </section>
    );
}

export default Photos;

function LoaderLink() {
    return(
        <div className="loader-link">
            <div className="album-preview">
                <div className="img_wrapper photo-3 loadingBGColor"/>
                <div className="img_wrapper photo-2 loadingBGColor"/>
                <div className="img_wrapper photo-1 loadingBGColor"/>
            </div>
            <div className="album-name loadingBGColor"/>
        </div>
    );
}

function AlbumLink({ album }) {
    return(
        <Link to={`./photos/${album._id}`}>
            <div className="album-preview">
                { album.photos.length > 2 && <div className="img_wrapper photo-3">
                    <ImgHandler src={photoExists(album.photos[2])} type="photo"/>
                </div> }
                { album.photos.length > 1 && <div className="img_wrapper photo-2">
                    <ImgHandler src={photoExists(album.photos[1])} type="photo"/>
                </div> }
                { album.photos.length > 0 && <div className="img_wrapper photo-1">
                    <ImgHandler src={photoExists(album.photos[0])} type="photo"/>
                </div> }
            </div>
            <h4>{album.name}</h4>
        </Link>
    );
}
