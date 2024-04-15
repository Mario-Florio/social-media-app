import { useState } from "react";
import "./photos.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Header from "./header/Header";
import UploadForm from "./uploadForm/UploadForm";
import SectionWrapper from "../../components/sectionWrapper/SectionWrapper";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import requests from "../../serverRequests/methods/config";

function PhotosPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [albums, setAlbums] = useState([]);
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
                    albums={albums}
                    setAlbums={setAlbums}
                />
                <ul>
                    { isLoading ?
                        loaders.map(num => <LoaderPhoto key={num}/>) :
                        photos.map(photo => <Photo key={photo._id} data={photo}/>) }
                </ul>
                { id === user._id && albums.length && <UploadForm albums={albums} userId={id}/> }
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
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDeletePopupIsActive, setConfirmDeletePopupIsActive] = useState(false)
    const [maskIsActive, setMaskIsActive] = useState(false);
    const [optionsSectionIsActive, setOptionsSectionIsActive] = useState(false);
    const { id } = useParams();
    const { user, token } = useAuth();

    async function deletePhoto() {
        setIsLoading(true);
        try {

            const reqBody = {
                token,
                id: data._id,
            }

            const res = await requests.albums.deletePhoto(reqBody);
            
            if (res.success) {
                setConfirmDeletePopupIsActive(false);
            } else {
                alert(res.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <li>
            <div className="img_wrapper">
                <img src={data.url} alt={data.name}/>
            </div>
            <div
                className={maskIsActive ? "photo_mask active" : "photo_mask"}
                onMouseEnter={() => setMaskIsActive(true)}
                onMouseLeave={() => setMaskIsActive(false)}
            >
                <div className="flexbox">
                    <h3>{data.name}</h3>
                    { id === user._id && <OptionsButton setOptionsSectionIsActive={setOptionsSectionIsActive}/> }
                </div>
                <div className="caption_wrapper">
                    <p>{data.caption}</p>
                </div>
            </div>
            { optionsSectionIsActive && <SectionWrapper
                sectionClassName={"photo-options-section"}
                sectionIsActive={optionsSectionIsActive}
                setSectionIsActive={setOptionsSectionIsActive}
            >
                <ul>
                    <li onClick={() => setConfirmDeletePopupIsActive(true)}>Delete</li>
                </ul>
                <div className={confirmDeletePopupIsActive ? "popup_mask active" : "popup_mask"}>
                    <div className="confirm-delete_popup">
                        <p>Are you sure you want to delete this photo?</p>
                        <button disabled={isLoading} onClick={async () => await deletePhoto()}>Confirm</button>
                        <button disabled={isLoading} onClick={() => setConfirmDeletePopupIsActive(false)}>Cancel</button>
                    </div>
                </div>
            </SectionWrapper> }
        </li>
    );
}

function OptionsButton({ setOptionsSectionIsActive }) {
    return(
        <div
            className="options"
            onClick={() => setOptionsSectionIsActive(true)}
        >
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
