import { useState } from "react";
import "./profileTop.css";
import ImgHandler from "../../../components/imgHandler/ImgHandler";
import photoExists from "../../../components/imgHandler/__utils__/photoExists";
import PicturePopup from "./picturePopup/PicturePopup";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { profilePicImages, coverPhotoImages } from "../../../defaultImages/defaultImages";

function ProfileTop() {
    const { profileUser } = useProfile();

    return(!profileUser ?
        <Loader/> :
        <Loaded profileUser={profileUser}/>
    );
}

export default ProfileTop;

function Loaded({ profileUser }) {
    const { user } = useAuth();

    const [picture, setPicture] = useState(photoExists(profileUser.profile.picture));
    const [picturePopupIsActive, setPicturePopupIsActive] = useState(false);

    const [coverPhoto, setCoverPhoto] = useState(photoExists(profileUser.profile.coverPicture));
    const [coverPhotoPopupIsActive, setCoverPhotoPopupIsActive] = useState(false);

    return(
        <section className="profileTop">
            { profileUser._id === user._id ?
                <>
                    <div className="coverPhoto_wrapper">
                        <ImgHandler src={coverPhoto} type="cover" classes="coverPhoto"/>
                        <div className="coverPhoto_mask" onClick={() => setCoverPhotoPopupIsActive(true)}></div>
                    </div>
                    <div className="profilePic_wrapper">
                        <ImgHandler src={picture} type="profile" classes="profilePic"/>
                        <div className="profilePic_mask" onClick={() => setPicturePopupIsActive(true)}></div>
                    </div>
                </> :
                <>
                    <div className="coverPhoto_wrapper">
                        <ImgHandler src={coverPhoto} type="cover" classes="coverPhoto"/>
                    </div>
                    <div className="profilePic_wrapper">
                        <ImgHandler src={picture} type="profile" classes="profilePic"/>
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
    )
}

function Loader() {
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
