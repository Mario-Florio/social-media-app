import { useEffect, useState } from "react";
import "./deleteSection.css";
import SectionWrapper from "../../../../components/sectionWrapper/SectionWrapper";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useAuth } from "../../../../hooks/useAuth";

import requests from "../../../../serverRequests/methods/config";

function DeleteSection({ data, albums, setAlbums, selectedAlbum, setSelectedAlbum, setPhotos, sectionIsActive, setSectionIsActive }) {
    const [selectAlbums, setSelectAlbums] = useState([]);
    const [deleteEverywhere, setDeleteEverywhere] = useState(false);
    const [albumId, setAlbumId] = useState();
    const [confirmDeletePopupIsActive, setConfirmDeletePopupIsActive] = useState(false);

    useEffect(() => {
        const selectAlbums = albums.filter(album => album.name !== "All");
        setSelectAlbums(selectAlbums);
        setAlbumId(selectAlbums[0]._id);
    }, [albums]);

    function handleChange(e) {
        setAlbumId(e.target.value);
    }

    return(
        <SectionWrapper
            sectionClassName={"photo-delete-section"}
            sectionIsActive={sectionIsActive}
            setSectionIsActive={setSectionIsActive}
        >
            <form onSubmit={(e) => e.preventDefault()}>
                <FieldSet deleteEverywhere={deleteEverywhere} setDeleteEverywhere={setDeleteEverywhere}/>
                <label htmlFor="album">Album</label><br/>
                <select name="album" id="album" value={albumId} onChange={handleChange} disabled={deleteEverywhere}>
                    { selectAlbums.map(album =>
                        <option key={album.name} value={album._id} id="album">{album.name}</option>) }
                </select><br/>
                <button onClick={() => setConfirmDeletePopupIsActive(true)}>Delete</button>
            </form>
            <ConfirmDeletePopup
                data={data}
                albums={albums}
                setAlbums={setAlbums}
                selectedAlbum={selectedAlbum}
                setSelectedAlbum={setSelectedAlbum}
                setPhotos={setPhotos}
                isActive={confirmDeletePopupIsActive}
                setIsActive={setConfirmDeletePopupIsActive}
                setSectionIsActive={setSectionIsActive}
                deleteEverywhere={deleteEverywhere}
                albumId={albumId}
            />
        </SectionWrapper>
    );
}

export default DeleteSection;

function FieldSet({ deleteEverywhere, setDeleteEverywhere }) {

    function handleChange(e) {
        setDeleteEverywhere(e.target.value === "yes");
    }

    return(
        <fieldset>
            <p>Delete Everywhere?</p>
            <label htmlFor="delete-everywhere">No</label>
            <input
                name="delete-everywhere"
                type="radio"
                value="no"
                id="delete-everywhere"
                onChange={handleChange}
                checked={!deleteEverywhere}
            /><br/>
            <label htmlFor="delete-everywhere">Yes</label>
            <input
                name="delete-everywhere"
                type="radio"
                value="yes"
                id="delete-everywhere"
                onChange={handleChange}
                checked={deleteEverywhere}
            /><br/>
        </fieldset>
    );
}

function ConfirmDeletePopup({ data, albums, setAlbums, selectedAlbum, setSelectedAlbum, setPhotos, isActive, setIsActive, setSectionIsActive, deleteEverywhere, albumId }) {
    const [isLoading, setIsLoading] = useState(false);

    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { token, user, updateUser } = useAuth();

    async function deletePhoto() {
        setIsLoading(true);
        try {
            let allAlbum;
            if (deleteEverywhere) {
                [ allAlbum ] = albums.filter(album => album.name === "All");
            }
            const reqBody = {
                token,
                albumId: deleteEverywhere ? allAlbum._id : albumId,
                photoId: data._id
            }

            const res = await requests.albums.deletePhoto(reqBody);
            
            if (res.success) {
                const updatedAlbums = albums.map(album => {
                    if (deleteEverywhere) {
                        const filteredPhotos = album.photos.filter(photo => photo._id !== data._id);
                        album.photos = filteredPhotos;
                    } else if (album._id === albumId) {
                        const filteredPhotos = album.photos.filter(photo => photo._id !== data._id);
                        album.photos = filteredPhotos;
                    }
                    return album;
                });
                const [ updatedSelectedAlbum ] = updatedAlbums.filter(album => album._id === selectedAlbum._id);

                if (user.profile.picture && user.profile.picture._id === data._id) updateUser({
                    ...user,
                    profile: { ...user.profile, picture: null }
                });
                if (user.profile.coverPicture && user.profile.coverPicture._id === data._id) updateUser({
                    ...user,
                    profile: { ...user.profile, coverPicture: null }
                });

                setAlbums(updatedAlbums);
                setSelectedAlbum(updatedSelectedAlbum);
                setPhotos(updatedSelectedAlbum.photos);
                setIsActive(false);
                setSectionIsActive(false);
            }

            setResponsePopupData({ message: res.message, success: res.success });
            setResponsePopupIsActive(true);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className={isActive ? "popup_mask active" : "popup_mask"}>
            <div className="confirm-delete_popup">
                <p>Are you sure you want to delete this photo?</p>
                <button disabled={isLoading} onClick={async () => await deletePhoto()}>Confirm</button>
                <button disabled={isLoading} onClick={() => setIsActive(false)}>Cancel</button>
            </div>
        </div>
    );
}
