import { useEffect, useState } from "react";
import "./topbar.css";
import searchIcon from "../../assets/imgs/search-icon.png";

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

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    return(
        <form onSubmit={handleSubmit} className={ isFocused ? "focused" : "" }>
            <label htmlFor="search" className="hide">Search</label>
            <button>
                <img src={searchIcon} alt="Search"/>
            </button>
            <input
                type="text"
                name="search"
                id="search"
                placeholder="Search something..."
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </form>
    );
}