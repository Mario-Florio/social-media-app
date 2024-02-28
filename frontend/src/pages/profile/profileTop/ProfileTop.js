import { useEffect, useState } from "react";
import "./profileTop.css";
import { useAuth } from "../../../hooks/useAuth";

function ProfileTop({ profileUser, isLoading }) {
    const [picture, setPicture] = useState(profileUser.profile.picture);
    const [picturePopupIsActive, setPicturePopupIsActive] = useState(false);
    const [coverPhoto, setCoverPhoto] = useState(profileUser.profile.coverPicture);
    const [coverPhotoPopupIsActive, setCoverPhotoPopupIsActive] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        setCoverPhoto(profileUser.profile.coverPicture);
        setPicture(profileUser.profile.picture);
    }, [profileUser]);

    return(
        <section className="profileTop">
            { isLoading ?
                <div className="coverPhoto_wrapper">
                    <div className="loadingBGColor coverPhoto"></div>
                </div> :
                profileUser._id === user._id ?
                    <div className="coverPhoto_wrapper">
                        <img src={ coverPhoto || "../../assets/imgs/default/cover-photo.jpg" } alt="cover" className="coverPhoto"/>
                        <div className="coverPhoto_mask" onClick={() => setCoverPhotoPopupIsActive(true)}></div>
                    </div> :
                    <div className="coverPhoto_wrapper">
                        <img src={ coverPhoto || "../../assets/imgs/default/cover-photo.jpg" } alt="cover" className="coverPhoto"/>
                    </div> }
            { isLoading ?
                <div className="profilePic_wrapper">
                    <div className="loadingBGColor profilePic"></div>
                </div> :
                profileUser._id === user._id ?
                    <div className="profilePic_wrapper">
                        <img src={ picture || "../../assets/imgs/default/profile-picture.jpg" } alt="profile" className="profilePic"/>
                        <div className="profilePic_mask" onClick={() => setPicturePopupIsActive(true)}></div>
                    </div> :
                    <div className="profilePic_wrapper">
                        <img src={ picture || "../../assets/imgs/default/profile-picture.jpg" } alt="profile" className="profilePic"/>
                    </div> }
            <PicturePopup
                isActive={picturePopupIsActive}
                setIsActive={setPicturePopupIsActive}
                setPicture={setPicture}
            />
            <CoverPhotoPopup
                isActive={coverPhotoPopupIsActive}
                setIsActive={setCoverPhotoPopupIsActive}
                setPhoto={setCoverPhoto}
            />
        </section>
    );
}

export default ProfileTop;

function PopupWrapper({ children }) {
    return(
        <div className="popup_mask">
            <article className="popup">
                {children}
            </article>
        </div>
    );
}

function PicturePopup({ isActive, setIsActive, setPicture }) {
    function handleSubmit(e) {
        e.preventDefault();
        setPicture(URL.createObjectURL(e.target.children[1].files[0]));
        setIsActive(false);
    }
    return(isActive &&
        <PopupWrapper>
            <form onSubmit={handleSubmit}>
                    <label htmlFor="picture">Profile Picture</label>
                    <input
                        type="file"
                        name="picture"
                        id="picture"
                        accept="image/*"
                    />
                    <button>Upload</button>
                    <button onClick={() => setIsActive(false)}>Cancel</button>
                </form>
        </PopupWrapper>
    );
}

function CoverPhotoPopup({ isActive, setIsActive, setPhoto }) {
    function handleSubmit(e) {
        e.preventDefault();
        setPhoto(URL.createObjectURL(e.target.children[1].files[0]));
        setIsActive(false);
    }
    return(isActive &&
        <PopupWrapper>
            <form onSubmit={handleSubmit}>
                <label htmlFor="cover-picture">Cover Picture</label>
                <input
                    type="file"
                    name="cover-picture"
                    id="cover-picture"
                    accept="image/*"
                />
                <button>Upload</button>
                <button onClick={() => setIsActive(false)}>Cancel</button>
            </form>
        </PopupWrapper>
    );
}
