import { useEffect, useState } from "react";
import "./profileTop.css";
import PicturePopup from "./picturePopup/PicturePopup";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { defaultProfilePic, defaultCoverPhoto, profilePicImages, coverPhotoImages } from "../../../defaultImages/defaultImages";

function ProfileTop() {
    const { user } = useAuth();
    const { profileUser } = useProfile();

    const [picture, setPicture] = useState(null);
    const [picturePopupIsActive, setPicturePopupIsActive] = useState(false);

    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoPopupIsActive, setCoverPhotoPopupIsActive] = useState(false);

    useEffect(() => {
        profileUser &&
        profileUser.profile.coverPicture &&
        profileUser.profile.coverPicture.url &&
        setCoverPhoto(profileUser.profile.coverPicture.url);

        profileUser &&
        profileUser.profile.picture &&
        profileUser.profile.picture.url &&
        setPicture(profileUser.profile.picture.url);

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
                        <img src={ coverPhoto || defaultCoverPhoto.url } alt="cover" className="coverPhoto"/>
                        <div className="coverPhoto_mask" onClick={() => setCoverPhotoPopupIsActive(true)}></div>
                    </div>
                    <div className="profilePic_wrapper">
                        <img src={ picture || defaultProfilePic.url } alt="profile" className="profilePic"/>
                        <div className="profilePic_mask" onClick={() => setPicturePopupIsActive(true)}></div>
                    </div>
                </> :
                <>
                    <div className="coverPhoto_wrapper">
                        <img src={ coverPhoto || defaultCoverPhoto.url } alt="cover" className="coverPhoto"/>
                    </div>
                    <div className="profilePic_wrapper">
                        <img src={ picture || defaultProfilePic.url } alt="profile" className="profilePic"/>
                    </div>
                </> }
            { picturePopupIsActive && <PicturePopup
                name="picture"
                setIsActive={setPicturePopupIsActive}
                setPicture={setPicture}
                options={ profilePicImages.map(image => { return { name: image.name.split("-")[0], value: image.name, url: image.url } }) }
            /> }
            { coverPhotoPopupIsActive && <PicturePopup
                name="coverPicture"
                setIsActive={setCoverPhotoPopupIsActive}
                setPicture={setCoverPhoto}
                options={ coverPhotoImages.map(image => { return { name: image.name.split("-")[0], value: image.name, url: image.url } }) }
            /> }
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
