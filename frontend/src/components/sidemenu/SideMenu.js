import "./sideMenu.css";
import { Link } from "react-router-dom";
import profilePic from "../../assets/imgs/profile-pic.jpg";

function SideMenu({ sideMenuIsActive, setSideMenuIsActive }) {

    function handleClick() {
        setSideMenuIsActive(false);
    }

    return(
        <section className={ sideMenuIsActive ? "sidemenu active" : "sidemenu" }>
            <nav>
                <ul>
                    <li>
                        <Link to="/" onClick={handleClick}>
                            <p>Home</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" onClick={handleClick}>
                            <p>Profile</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            <hr/>
            <h2>Followers</h2>
            <ul>
                <li>
                    <Link onClick={handleClick}>
                        <article>
                            <img src={profilePic} alt="Profile pic"/>
                            <h3>User Name</h3>
                        </article>
                    </Link>
                </li>
            </ul>
        </section>
    )
}

export default SideMenu;