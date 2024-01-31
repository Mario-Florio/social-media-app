import { useEffect, useState } from "react";
import "./topbar.css";
import searchIcon from "../../assets/imgs/search-icon.png";

function Topbar({ setSideMenuIsActive }) {
    return(
        <section className="topbar">
            <HamburgerMenu setSideMenuIsActive={setSideMenuIsActive}/>
            <SearchBar/>
        </section>
    );
}

export default Topbar;

function HamburgerMenu({ setSideMenuIsActive }) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setSideMenuIsActive(isActive);
    }, [isActive, setIsActive, setSideMenuIsActive]);

    function handleClick() {
        setIsActive(!isActive);
    }

    return(
        <div onClick={handleClick} className={ isActive ? "hamburger-menu active" : "hamburger-menu" }>
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