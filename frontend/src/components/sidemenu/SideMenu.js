import "./sideMenu.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { getFollowingData } from "../../dummyData";
import { useEffect, useState } from "react";

function SideMenu({ sideMenuIsActive, setSideMenuIsActive }) {
    const { user } = useAuth();
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const followingData = getFollowingData(user);
        setFollowing(followingData);
    }, [user]);

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
                        <Link to={`/profile/${user.profile._id}`} onClick={handleClick}>
                            <p>Profile</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            <hr/>
            <h2>Following</h2>
            <ul>
                {
                    following.map(u => {
                        return <li key={u._id}>
                            <Link to={`/profile/${u.profile._id}`} onClick={handleClick}>
                                <article>
                                    <img src={u.profile.pic} alt="Profile pic"/>
                                    <h3>{u.username}</h3>
                                </article>
                            </Link>
                        </li>
                    })
                }
            </ul>
        </section>
    )
}

export default SideMenu;