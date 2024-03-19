import { useEffect, useState } from "react";
import "./profileTop.css";
import { useAuth } from "../../../hooks/useAuth";

function ProfileTop({ profileUser }) {
    const [picture, setPicture] = useState(null);
    const [picturePopupIsActive, setPicturePopupIsActive] = useState(false);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoPopupIsActive, setCoverPhotoPopupIsActive] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        profileUser && setCoverPhoto(profileUser.profile.coverPicture);
        profileUser && setPicture(profileUser.profile.picture);
        return () => {
            setCoverPhoto(null);
            setPicture(null);
        }
    }, [profileUser]);

    return(!profileUser ?
        <LoaderProfile/> :
        <section className="profileTop">
            { profileUser._id === user._id ?
                <>
                    <div className="coverPhoto_wrapper">
                        <img src={ coverPhoto || "../../assets/imgs/default/cover-photo.jpg" } alt="cover" className="coverPhoto"/>
                        <div className="coverPhoto_mask" onClick={() => setCoverPhotoPopupIsActive(true)}></div>
                    </div>
                    <div className="profilePic_wrapper">
                        <img src={ picture || "../../assets/imgs/default/profile-picture.jpg" } alt="profile" className="profilePic"/>
                        <div className="profilePic_mask" onClick={() => setPicturePopupIsActive(true)}></div>
                    </div>
                </> :
                <>
                    <div className="coverPhoto_wrapper">
                        <img src={ coverPhoto || "../../assets/imgs/default/cover-photo.jpg" } alt="cover" className="coverPhoto"/>
                    </div>
                    <div className="profilePic_wrapper">
                        <img src={ picture || "../../assets/imgs/default/profile-picture.jpg" } alt="profile" className="profilePic"/>
                    </div>
                </> }
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

function LoaderProfile() {
    return(
        <section className="profileTop">
            <div className="coverPhoto_wrapper">
                <div className="loadingBGColor coverPhoto"></div>
            </div>
            <div className="profilePic_wrapper">
                <div className="loadingBGColor profilePic"></div>
            </div>
        </section>
    );
}

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
        if (e.target.children[1].files[0]) {
            setPicture(URL.createObjectURL(e.target.children[1].files[0]));
        }
        setIsActive(false);
    }

    function handelCancel(e) {
        e.preventDefault();
        setIsActive(false)
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
                    <button onClick={handelCancel}>Cancel</button>
                </form>
        </PopupWrapper>
    );
}

function CoverPhotoPopup({ isActive, setIsActive, setPhoto }) {

    function handleSubmit(e) {
        e.preventDefault();
        if (e.target.children[1].files[0]) {
            setPhoto(URL.createObjectURL(e.target.children[1].files[0]));
        }
        setIsActive(false);
    }

    function handelCancel(e) {
        e.preventDefault();
        setIsActive(false)
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
                <button onClick={handelCancel}>Cancel</button>
            </form>
        </PopupWrapper>
    );
}
