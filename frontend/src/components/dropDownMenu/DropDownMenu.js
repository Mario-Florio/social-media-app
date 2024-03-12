import "./dropDownMenu.css";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme/useTheme";

function DropDownMenu({ dropDownMenuIsActive }) {
    return(
        <section className={ dropDownMenuIsActive ? "drop-down-menu active" : "drop-down-menu" }>
            <div className="tail"/>
            <nav>
                <ul>
                    <li>
                        <Link to="/settings">
                            <p>General Settings</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings/user">
                            <p>User Settings</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings/profile">
                            <p>Profile Settings</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            <DarkModeButton/>
        </section>
    );
}

export default DropDownMenu;

function DarkModeButton() {
    const { darkModeIsActive, setDarkModeIsActive } = useTheme();

    function toggleDarkMode() {
        setDarkModeIsActive(!darkModeIsActive);
    }

    return(
        <div className="darkmode-button_wrapper">
            <span>Dark Mode</span>
            <div className={ darkModeIsActive ? "darkmode-button_container active" : "darkmode-button_container"}>
                <button onClick={toggleDarkMode} className={ darkModeIsActive ? "darkmode-button active" : "darkmode-button" }/>
            </div>
        </div>
    )
}
