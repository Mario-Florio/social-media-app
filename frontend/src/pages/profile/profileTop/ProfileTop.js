import { useEffect, useState } from "react";
import "./profileTop.css";
import PicturePopup from "./picturePopup/PicturePopup";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

function ProfileTop() {
    const { user } = useAuth();
    const { profileUser } = useProfile();

    const [picture, setPicture] = useState(null);
    const [picturePopupIsActive, setPicturePopupIsActive] = useState(false);

    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoPopupIsActive, setCoverPhotoPopupIsActive] = useState(false);

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
            { picturePopupIsActive && <PicturePopup
                name="picture"
                setIsActive={setPicturePopupIsActive}
                setPicture={setPicture}
                options={[
                    { name: "Jane Dough", value: "/assets/imgs/janeDough/profile-pic.jpg" },
                    { name: "Jesus Christ", value: "/assets/imgs/jesusChrist/profile-pic.jpg" },
                    { name: "Tyrion Lannister", value: "/assets/imgs/tyrionLannister/profile-pic.jpg" },
                    { name: "Jinx", value: "/assets/imgs/jinx/profile-pic.jpg" },
                    { name: "Nea Karlsson", value: "/assets/imgs/neaKarlsson/profile-pic.jpg" },
                    { name: "Rust Cohle", value: "/assets/imgs/rustCohle/profile-pic.jpg" },
                    { name: "Ellie Williams", value: "/assets/imgs/ellieWilliams/profile-pic.jpg" }
                ]}
            /> }
            { coverPhotoPopupIsActive && <PicturePopup
                name="coverPicture"
                setIsActive={setCoverPhotoPopupIsActive}
                setPicture={setCoverPhoto}
                options={[
                    { name: "Jane Dough", value: "/assets/imgs/janeDough/cover-photo.jpg" },
                    { name: "Jesus Christ", value: "/assets/imgs/jesusChrist/cover-photo.jpg" },
                    { name: "Tyrion Lannister", value: "/assets/imgs/tyrionLannister/cover-photo.jpg" },
                    { name: "Jinx", value: "/assets/imgs/jinx/cover-photo.jpg" },
                    { name: "Nea Karlsson", value: "/assets/imgs/neaKarlsson/cover-photo.jpg" },
                    { name: "Rust Cohle", value: "/assets/imgs/rustCohle/cover-photo.jpg" },
                    { name: "Ellie Williams", value: "/assets/imgs/ellieWilliams/cover-photo.jpg" }
                ]}
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
