import "./home.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";

import getPosts from "../../mockDB/databases/Posts";

const posts = getPosts();

function Home() {
    return(
        <PageLayout>
            <section id="home" className="main-component">
                <Timeline posts={posts}/> 
            </section>
        </PageLayout>
    );
}

export default Home;