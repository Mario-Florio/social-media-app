import { useEffect, useState } from "react";
import "./responsePopup.css";

function ResponsePopup({ message="", success=true, setIsMounted }) {
    const [isActive, setIsActive] = useState(false);
    const [title, setTitle] = useState(message.includes(":") ? message.split(":")[0].trim() : message);
    const [body, setBody] = useState(message.includes(":") ? message.split(":")[1].trim() : "");

    useEffect(() => {
        const intitialAnimation = setTimeout(() => setIsActive(true), 250);
        const departingAnimation = setTimeout(() => setIsActive(false), 5250);
        const unmount = setTimeout(() => setIsMounted(false), 5550);

        return () => {
            clearTimeout(intitialAnimation);
            clearTimeout(departingAnimation);
            clearTimeout(unmount);
        }
    }, []);

    function handleClick() {
        setIsActive(false);
        setTimeout(() => setIsMounted(false), 250);
    }

    return(
        <div className={
            isActive && success ? "response-popup active successful" :
            isActive && !success ? "response-popup active failed" :
            !isActive && success ? "response-popup success" :
            (!isActive && !success) && "response-popup failed"
        }>
            <div className="closeout-icon_wrapper">
                <button onClick={handleClick}>
                    <div className="bar vertical"/>
                    <div className="bar horizontal"/>
                </button>
            </div>
            <div className="message">
                <h3 style={{ color: "black" }}>{title}</h3>
                <p style={{ color: "black" }}>{body}</p>
            </div>
        </div>
    );
}

export default ResponsePopup;