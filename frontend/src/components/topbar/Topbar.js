import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./topbar.css";
import "./searchbar.css"
import searchIcon from "../../assets/imgs/search-icon.png";
import { useAuth } from "../../hooks/useAuth";

import { searchUsers } from "../../mockDB/methods/users";

function Topbar({ sideMenuIsActive, setSideMenuIsActive }) {
    const { user } = useAuth();
    return(
        <header className="topbar">
            <Link to="/">
                <h1 className="logo">Logo</h1>
            </Link>
            <HamburgerMenu
                sideMenuIsActive={sideMenuIsActive}
                setSideMenuIsActive={setSideMenuIsActive}
            />
            <SearchBar/>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to={`/profile/${user.profile._id}`}>Profile</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Topbar;

function HamburgerMenu({ sideMenuIsActive, setSideMenuIsActive }) {

    function handleClick() {
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
        const suggestions = searchUsers(input);
        setSuggestions(suggestions);
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
                    <button>
                        <img src={searchIcon} alt="Search"/>
                    </button>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search something..."
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
                                to={`/profile/${user.profile._id}`}
                                onClick={() => setInput("")}
                            >
                                <div className="profile-pic_wrapper">
                                    <img src={user.profile.picture} alt="user profile pic"/>
                                </div>
                                <h5>{user.username}</h5>
                            </Link>
                        </li>) }
                </ul>
            </div>
        </div>
    );
}
