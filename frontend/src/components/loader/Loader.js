import "./loader.css";

function Loader({ color, secondaryColor, size }) {
    const borderTopColor = { borderTopColor: color || "var(--target-color" };
    const borderColor = { borderColor: secondaryColor || "var(--secondary-color" };
    const heightByWidth = {
        height: `${size}px` || "40px",
        width: `${size}px` || "40px",
        borderWidth: `${size/6.66666667}px` || "6px"
    }
    
    return(
        <div
            className="loader"
            style={{
                ...borderColor,
                ...borderTopColor,
                ...heightByWidth
            }}
        ></div>
    );
}

export default Loader;