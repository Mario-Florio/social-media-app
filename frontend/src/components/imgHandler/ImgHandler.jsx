import { useState } from "react";
import { defaultProfilePic, defaultCoverPhoto } from "../../defaultImages/defaultImages";
import photoNotFoundUrl from "../../assets/imgs/photo404.jpg";

function ImgHandler({ src, type, classes="" }) {
    if (!type) throw new Error("ImgHandler requires definition of \"type\" parameter");
    if (type !== "profile" && type !== "cover" && type !== "photo") throw new Error("Invalid definition of ImgHandler \"type\"");

    const [imgSrc, setImgSrc] = useState(src || "");

    function handleError() {
        const fallbackSrc =
            type === "profile" ? defaultProfilePic.url :
            type === "cover" ? defaultCoverPhoto.url : photoNotFoundUrl;

        setImgSrc(fallbackSrc);
    }
    
    const alt =
        type === "profile" ? "users profile pic" :
        type === "cover" ? "users cover photo" : "";

    return(
        <img src={imgSrc} onError={handleError} alt={alt} className={classes}/>
    );
}

export default ImgHandler;