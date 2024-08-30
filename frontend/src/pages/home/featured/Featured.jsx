import { useEffect, useState } from "react";
import "./featured.css";
import { Link } from "react-router-dom";
import requests from "../../../serverRequests/methods/config";
import { defaultProfilePic } from "../../../defaultImages/defaultImages";

const { getUsers } = requests.users;

function Featured({ selectedTab }) {
    return(
        <section id="featured" className={ selectedTab === "featured" ? "main-component active" : "main-component" }>
            <h2>Featured</h2>
            <Users/>
        </section>
    );
}

export default Featured;

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const reqBody = { queryBody: { limit: 7 } };
            const res = await getUsers(reqBody);
            if (res.success) setUsers(res.users);
        })();
    }, []);

    return(
        <ul className="users">
            {users.map(user =>
                <li key={user._id}>
                    <Link to={`/users/${user._id}`}>
                        <div className="user">
                            <div className="profilePic-wrapper">
                                <img src={ user.profile.picture ? (user.profile.picture.url || defaultProfilePic.url) : defaultProfilePic.url }/>
                            </div>
                            <h4>{user.username}</h4>
                        </div>
                    </Link>
                </li>
            )}
        </ul>
    );
}