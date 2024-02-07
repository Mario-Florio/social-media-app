import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./topbar.css";
import searchIcon from "../../assets/imgs/search-icon.png";

import getData from "../../dummyData";

function Topbar({ sideMenuIsActive, setSideMenuIsActive }) {
    return(
        <header className="topbar">
            <HamburgerMenu
                sideMenuIsActive={sideMenuIsActive}
                setSideMenuIsActive={setSideMenuIsActive}
            />
            <SearchBar/>
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
        const suggestions = searchData(input);
        setSuggestions(suggestions);

        function searchData(input) {
            const { users } = getData();

            const results = [];
            users.forEach(user => {
                if (user.username.toLowerCase().includes(input.toLowerCase())) {
                    results.push(user);
                }
            });
            
            return results;
        }
    }, [input]);

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur(e) {
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
        <form onSubmit={handleSubmit} className={ isFocused ? "focused" : "" }>
            <div className="dropdown">
                <div className="dropdown_top">
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
                </div>
                <ul className={ isFocused ? "dropdown_bottom active" : "dropdown_bottom" }>
                    { input.length > 0 && suggestions.map(user =>
                        <li key={user._id}>
                            <Link
                                to={`/profile/${user.profile._id}`}
                                onClick={() => setInput("")}
                            >
                                <div className="profile-pic_wrapper">
                                    <img src={user.profile.pic} alt="user profile pic"/>
                                </div>
                                <h5>{user.username}</h5>
                            </Link>
                        </li>) }
                </ul>
            </div>
        </form>
    );
}
