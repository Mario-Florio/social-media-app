import "./loader.css";

function Loader({ color="dodgerblue", secondaryColor="lightgray", size=40 }) {
    const borderTopColor = { borderTopColor: color };
    const borderColor = { borderColor: secondaryColor };
    const heightByWidth = {
        height: `${size}px`,
        width: `${size}px`,
        borderWidth: `${size/6.66666667}px`
    }

    const styles = {
        ...borderColor,
        ...borderTopColor,
        ...heightByWidth
    }
    
    return(
        <div
            className="loader"
            style={styles}
        ></div>
    );
}

export default Loader;