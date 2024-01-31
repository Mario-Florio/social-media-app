import { useState } from "react";
import "./home.css";
import Topbar from "../../components/topbar/Topbar";
import SideMenu from "../../components/sidemenu/SideMenu";
import jesus from "../../assets/imgs/jesus.jpg"
import profilePic from "../../assets/imgs/profile-pic.jpg";

function Home({ user, setUser }) {
    const [sideMenuIsActive, setSideMenuIsActive] = useState(false);

    return(
        <>
            <header style={{ position: "sticky", top: "0" }}>
                <Topbar setSideMenuIsActive={setSideMenuIsActive}/>
            </header>
            <main>
                <SideMenu sideMenuIsActive={sideMenuIsActive}/>
                <NewPost/>
                <ul className="timeline">
                    <li><Post/></li>
                    <li><Post/></li>
                    <li><Post/></li>
                    <li style={{ textAlign: "center", margin: "3rem" }}>
                        <a href="" style={{ textDecoration: "none", color: "dodgerblue", fontSize: ".9rem" }}>See more...</a>
                    </li>
                </ul>
            </main>
        </>
    );
}

function NewPost() {
    const [input, setInput] = useState("");

    function handleChange(e) {
        setInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setInput("");
    }

    return(
        <article className="newPost">
            <a href="" className="profilePic-wrapper">
                <img src={jesus} alt="users profile pic"/>
            </a>
            <form onSubmit={handleSubmit}>
                <label htmlFor="newPost" className="hide">New Post</label>
                <textarea name="newPost" id="newPost" onChange={handleChange} value={input} placeholder="Write something..."></textarea>
                <button>Post</button>
            </form>
        </article>
    )
}

function Post() {
    return(
        <article className="post">
            <header>
                <a href="" className="profilePic-wrapper">
                    <img src={profilePic} alt="users profile pic"/>
                </a>
                <div className="title">
                    <a href="">
                        <h3>Profile Name</h3>
                    </a>
                    <span>Time passed</span>
                </div>
            </header>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ipsum a arcu cursus vitae congue mauris. Quis varius quam quisque id diam vel quam.</p>
            <footer>
                <div className="top">
                    <a href="">
                        <span># likes</span>
                    </a>
                    <a href="">
                        <span># comments</span>
                    </a>
                    <a href="">
                        <span># shares</span>
                    </a>
                </div>
                <hr/>
                <div className="bottom">
                    <a href="">
                        <span>Like</span>
                    </a>
                    <a href="">
                        <span>Comment</span>
                    </a>
                    <a href="">
                        <span>Share</span>
                    </a>
                </div>
            </footer>
        </article>
    );
}

export default Home;