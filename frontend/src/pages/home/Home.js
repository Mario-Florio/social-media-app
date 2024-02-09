import "./home.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";

import getData from "../../dummyData";

const { posts } = getData();

function Home() {
    return(
        <PageLayout>
            <section id="home">
                <Timeline posts={posts}/> 
            </section>
        </PageLayout>
    );
}

export default Home;