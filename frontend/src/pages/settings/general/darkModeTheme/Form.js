import { useEffect, useState } from "react";
import "./form.css";
import { useTheme } from "../../../../hooks/useTheme/useTheme";

function DarkModeThemeForm() {
    const { darkTheme, setDarkTheme, restoreDefaultDark } = useTheme();
    const [formInputs, setFormInputs] = useState(darkTheme);

    useEffect(() => {
        setFormInputs(darkTheme);
    }, [darkTheme]);

    function handleChange(e) {
        setFormInputs({
            ...formInputs,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit() {
        setDarkTheme({
            ...darkTheme,
            "--target-color": formInputs["--target-color"]
        });
    }

    return(
        <form className="dark-mode-theme-form" onSubmit={(e) => e.preventDefault()}>
            <h3 style={{ fontWeight: "300", color: "var(--secondary-font-color)", borderBottom: ".5px solid var(--secondary-font-color)" }}>Dark Mode Theme</h3>
            <div className="form-field">
                <label htmlFor="--target-color">Target Color</label>
                <input type="color" name="--target-color" id="--target-color" value={formInputs["--target-color"]} onChange={handleChange}/>
            </div>
            <button onClick={handleSubmit}>Submit</button>
            <button className="reset-button" onClick={restoreDefaultDark}>Restore Defaults</button>
        </form>
    );
}

export default DarkModeThemeForm;