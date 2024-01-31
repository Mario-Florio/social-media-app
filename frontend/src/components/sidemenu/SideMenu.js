import "./sideMenu.css";
import profilePic from "../../assets/imgs/profile-pic.jpg";

function SideMenu({ sideMenuIsActive }) {
    return(
        <section className={ sideMenuIsActive ? "sidemenu active" : "sidemenu" }>
            <nav>
                <ul>
                    <li>
                        <a href=""><p>Home</p></a>
                    </li>
                    <li>
                        <a href=""><p>Profile</p></a>
                    </li>
                </ul>
            </nav>
            <hr/>
            <h2>Followers</h2>
            <ul>
                <li>
                    <a href="">
                        <article>
                            <img src={profilePic} alt="Profile pic"/>
                            <h3>User Name</h3>
                        </article>
                    </a>
                </li>
            </ul>
        </section>
    )
}

export default SideMenu;