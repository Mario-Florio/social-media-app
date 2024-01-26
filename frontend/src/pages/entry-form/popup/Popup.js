import "./popup.css";

function Popup({ text, color="white" }) {
    return(
        <div className="popup" style={{backgroundColor: color}}>{text}</div>
    );
}

export default Popup;