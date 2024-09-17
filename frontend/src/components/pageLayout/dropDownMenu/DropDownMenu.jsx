import "./dropDownMenu.css";
import { Link } from "react-router-dom";
import ImgHandler from "../../imgHandler/ImgHandler";
import photoExists from "../../imgHandler/__utils__/photoExists";
import { useTheme } from "../../../hooks/useTheme/useTheme";
import { useAuth } from "../../../hooks/useAuth";

function DropDownMenu({ dropDownMenuIsActive, setDropDownMenuIsActive }) {
    const { user, logout } = useAuth();
    return(
        <section className={ dropDownMenuIsActive ? "drop-down-menu active" : "drop-down-menu" }>
            <div className="tail"/>
            <Link
                to={`/users/${user._id}`}
                onClick={() => setDropDownMenuIsActive(false)}
            >
                <div className="profileCover-wrapper">
                    <ImgHandler src={photoExists(user.profile.coverPicture)} type="cover"/>
                    <div className="profilePic-wrapper">
                    <ImgHandler src={photoExists(user.profile.picture)} type="profile"/>
                    </div>
                </div>
            </Link>
            <nav>
                <ul>
                    <li>
                        <Link
                            to="/settings"
                            onClick={() => setDropDownMenuIsActive(false)}
                        >
                            <p>General Settings</p>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/settings/user"
                            onClick={() => setDropDownMenuIsActive(false)}
                        >
                            <p>User Settings</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            <p style={{ marginBottom: ".5rem", cursor: "pointer" }} onClick={logout}>Logout</p>
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
