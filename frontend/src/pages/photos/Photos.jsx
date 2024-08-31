import { useState } from "react";
import "./photos.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Header from "./header/Header";
import Photo from "./photo/Photo";
import UploadForm from "./uploadForm/UploadForm";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function PhotosPage() {
    const { id, albumId } = useParams();
    const { user } = useAuth();
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState({ _id: albumId, name: "", photos: [], desc: "" });
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
                    selectedAlbum={selectedAlbum}
                    setSelectedAlbum={setSelectedAlbum}
                />
                <ul>
                    { isLoading ?
                        loaders.map(num => <LoaderPhoto key={num}/>) :
                        photos.map(photo =>
                            <Photo
                                key={photo._id}
                                data={photo}
                                albums={albums}
                                setAlbums={setAlbums}
                                selectedAlbum={selectedAlbum}
                                setSelectedAlbum={setSelectedAlbum}
                                setPhotos={setPhotos}
                            />
                        ) }
                </ul>
                { id === user._id && albums.length &&
                    <UploadForm
                        albums={albums}
                        setAlbums={setAlbums}
                        setPhotos={setPhotos}
                        selectedAlbum={selectedAlbum}
                        userId={id}
                    /> }
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
