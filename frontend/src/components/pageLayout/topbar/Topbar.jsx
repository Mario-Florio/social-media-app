import { useEffect, useState } from "react";
import "./topbar.css";
import "./searchbar.css"
import { Link } from "react-router-dom";
import ImgHandler from "../../imgHandler/ImgHandler";
import photoExists from "../../imgHandler/__utils__/photoExists";
import { useAuth } from "../../../hooks/useAuth";

import requests from "../../../serverRequests/methods/config";
const { getUsers } = requests.users;

function Topbar({ sideMenuIsActive, setSideMenuIsActive, dropDownMenuIsActive, setDropDownMenuIsActive }) {
    const { user } = useAuth();

    function toggleRightSideMenu() {
        sideMenuIsActive && setSideMenuIsActive(false);
        setDropDownMenuIsActive(!dropDownMenuIsActive);
    }

    return(
        <header className="topbar">
            <div className="flexbox-left_wrapper">
                <Link to="/">
                    <h1 className="logo">Logo</h1>
                </Link>
                <HamburgerMenu
                    sideMenuIsActive={sideMenuIsActive}
                    setSideMenuIsActive={setSideMenuIsActive}
                    setDropDownMenuIsActive={setDropDownMenuIsActive}
                />
                <SearchBar/>
            </div>
            <div className="flexbox-right_wrapper">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to={`/users/${user._id}`}>Profile</Link>
                        </li>
                    </ul>
                </nav>
                <div onClick={toggleRightSideMenu} className={ dropDownMenuIsActive ? "profilePic_wrapper active" : "profilePic_wrapper"}>
                    <ImgHandler src={photoExists(user.profile.picture)} type="profile"/>
                </div>
            </div>
        </header>
    );
}

export default Topbar;

function HamburgerMenu({ sideMenuIsActive, setSideMenuIsActive, setDropDownMenuIsActive }) {

    function handleClick() {
        setDropDownMenuIsActive(false);
        setSideMenuIsActive(!sideMenuIsActive);
    }

    return(
        <div onClick={handleClick} className={ sideMenuIsActive ? "hamburger-menu active" : "hamburger-menu" }>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

function SearchBar() {
    const [isFocused, setIsFocused] = useState(false);
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        input.length && (async () => {
            try {
                const reqBody = { queryBody: { search: input } };
                const res = await getUsers(reqBody);

                if (res.success) {
                    setSuggestions(res.users);
                }
            } catch (err) {
                console.log(err);
            }
        })();
        return () => setSuggestions([]);
    }, [input]);

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setTimeout(() => {
            setIsFocused(false);
        }, 130);
    }

    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setInput("");
    }

    return(
        <div onSubmit={handleSubmit} className={ isFocused ? "searchbar focused" : "searchbar" }>
            <div className="dropdown">
                <form className="dropdown_top">
                    <label htmlFor="search" className="hide">Search</label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search users..."
                        value={input}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        autoComplete="off"
                    />
                </form>
                <ul className={ isFocused ? "dropdown_bottom active" : "dropdown_bottom" }>
                    { input.length > 0 && suggestions.map(user =>
                        <li key={user._id}>
                            <Link
                                to={`/users/${user._id}`}
                                onClick={() => setInput("")}
                            >
                                <div className="profile-pic_wrapper">
                                    <ImgHandler src={photoExists(user.profile.picture)} type="profile"/>
                                </div>
                                <h5>{user.username}</h5>
                            </Link>
                        </li>) }
                </ul>
            </div>
        </div>
    );
}
