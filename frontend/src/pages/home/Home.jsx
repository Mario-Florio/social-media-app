import { useState } from "react";
import "./home.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Feed from "./feed/Feed";
import Featured from "./featured/Featured";

function Home() {
    const [selectedTab, setSelectedTab] = useState("feed");

    return(
        <PageLayout>
            <section id="home">
                <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
                <div className="pseudo-main" style={{ display: "flex", width: "100%" }}>
                    <Feed selectedTab={selectedTab}/>
                    <Featured selectedTab={selectedTab}/>
                </div>
            </section>
        </PageLayout>
    );
}

export default Home;

function Tabs({ selectedTab, setSelectedTab }) {
    return(
        <section className="tabs">
            <div
                className={ selectedTab === "feed" ? "isActive container" : "container" }
                onClick={() => setSelectedTab("feed")}>
                <span>Feed</span>
            </div>
            <div
                className={ selectedTab === "featured" ? "isActive container" : "container" }
                onClick={() => setSelectedTab("featured")}>
                <span>Featured</span>
            </div>
            <div className="spacer"/>
        </section>
    );
}