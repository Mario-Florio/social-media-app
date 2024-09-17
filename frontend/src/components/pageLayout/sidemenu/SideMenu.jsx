import { useEffect, useState } from "react";
import "./sideMenu.css";
import ImgHandler from "../../imgHandler/ImgHandler";
import photoExists from "../../imgHandler/__utils__/photoExists";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

import requests from "../../../serverRequests/requests";
const { getUsers } = requests.users;

function SideMenu({ sideMenuIsActive, setSideMenuIsActive }) {
    const { user } = useAuth();
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const queryBody = {
                    populate: {
                        model: "User",
                        _id: user._id,
                        fields: ["following"]
                    }
                }
                const res = await getUsers({ queryBody });

                if (res.success) {
                    setFollowing(res.users);
                }
            } catch (err) {
                console.log(err);
            }
        })();
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
                        <Link to={`/users/${user._id}`} onClick={handleClick}>
                            <p>Profile</p>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/settings"} onClick={handleClick}>
                            <p>Settings</p>
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
                            <Link to={`/users/${u._id}`} onClick={handleClick}>
                                <article>
                                    <ImgHandler src={photoExists(u.profile.picture)} type="profile"/>
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