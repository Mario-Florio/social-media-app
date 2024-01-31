import "./home.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import jesus from "../../assets/imgs/jesus.jpg"
import profilePic from "../../assets/imgs/profile-pic.jpg";

function Home({ user, setUser }) {

    return(
        <>
            <header style={{ position: "sticky", top: "0" }}>
                <Navbar/>
            </header>
            <main>
                <NewPost/>
                <ul className="timeline">
                    <li><Post/></li>
                    <li><Post/></li>
                    <li><Post/></li>
                </ul>
            </main>
            <Footer/>
        </>
    );
}

function NewPost() {
    return(
        <article className="newPost">
            <a href="" className="profilePic-wrapper">
                <img src={jesus} alt="users profile pic"/>
            </a>
            <form>
                <label htmlFor="newPost" className="hide">New Post</label>
                <textarea name="newPost" id="newPost" placeholder="Write something..."></textarea>
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