import "./rightSideMenu.css";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme/useTheme";

function RightSideMenu({ rightSideMenuIsActive, setRightSideMenuIsActive }) {
    return(
        <section className={ rightSideMenuIsActive ? "right-sidemenu active" : "right-sidemenu" }>
            <nav>
                <ul>
                    <li>
                        <Link to="/settings">
                            <p>General Settings</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings">
                            <p>User Settings</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings">
                            <p>Profile Settings</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            <DarkModeButton/>
        </section>
    );
}

export default RightSideMenu;

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
