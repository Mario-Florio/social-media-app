import { useState } from "react";
import "./photos.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Header from "./header/Header";
import UploadForm from "./uploadForm/UploadForm";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function PhotosPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const loaders = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    return(
        <PageLayout>
            <section id="photos" className="main-component">
                <Header
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setPhotos={setPhotos}
                />
                <ul>
                    { isLoading ?
                        loaders.map(num => <LoaderPhoto key={num}/>) :
                        photos.map(photo => <Photo key={photo._id} data={photo}/>) }
                </ul>
                { id === user._id && <UploadForm/> }
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
