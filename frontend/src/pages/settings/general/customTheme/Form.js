import { useEffect, useState } from "react";
import "./form.css";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useTheme } from "../../../../hooks/useTheme/useTheme";

function CustomThemeForm() {
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { theme, setTheme, restoreDefault } = useTheme();
    const [formInputs, setFormInputs] = useState(theme);

    useEffect(() => {
        setFormInputs(theme);
    }, [theme]);

    function handleChange(e) {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit() {
        setTheme({
            ...theme,
            "--background-color": formInputs["--background-color"],
            "--primary-color": formInputs["--primary-color"],
            "--secondary-color": formInputs["--secondary-color"],
            "--target-color": formInputs["--target-color"],
            "--hover-color": formInputs["--hover-color"],
            "--post-background-color": formInputs["--post-background-color"],
            "--primary-font-color": formInputs["--primary-font-color"],
            "--secondary-font-color": formInputs["--secondary-font-color"],
            "--box-shadow-color": formInputs["--box-shadow-color"]
        });
        
        setResponsePopupData({ message: "Update Successful", success: true });
        setResponsePopupIsActive(true);
    }

    return(
        <form className="custom-theme-form" onSubmit={(e) => e.preventDefault()}>
            <h3 style={{ fontWeight: "300", color: "var(--secondary-font-color)", borderBottom: ".5px solid var(--secondary-font-color)" }}>Custom Theme</h3>
            <div className="form-field">
                <label htmlFor="--background-color">Background Color</label>
                <input type="color" name="--background-color" id="--background-color" value={formInputs["--background-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--primary-color">Primary Color</label>
                <input type="color" name="--primary-color" id="--primary-color" value={formInputs["--primary-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--secondary-color">Secondary Color</label>
                <input type="color" name="--secondary-color" id="--secondary-color" value={formInputs["--secondary-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--target-color">Target Color</label>
                <input type="color" name="--target-color" id="--target-color" value={formInputs["--target-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--hover-color">Hover Color</label>
                <input type="color" name="--hover-color" id="--hover-color" value={formInputs["--hover-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--post-background-color">Post Background Color</label>
                <input type="color" name="--post-background-color" id="--post-background-color" value={formInputs["--post-background-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--primary-font-color">Primary Font Color</label>
                <input type="color" name="--primary-font-color" id="--primary-font-color" value={formInputs["--primary-font-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--secondary-font-color">Secondary Font Color</label>
                <input type="color" name="--secondary-font-color" id="--secondary-font-color" value={formInputs["--secondary-font-color"]} onChange={handleChange}/>
            </div>
            <div className="form-field">
                <label htmlFor="--box-shadow-color">Box Shadow Color</label>
                <input type="color" name="--box-shadow-color" id="--box-shadow-color" value={formInputs["--box-shadow-color"]} onChange={handleChange}/>
            </div>
            <div className="buttons_wrapper">
                <button onClick={handleSubmit}>Submit</button>
                <button className="reset-button" onClick={restoreDefault}>Restore Defaults</button>
            </div>
        </form>
    );
}

export default CustomThemeForm;