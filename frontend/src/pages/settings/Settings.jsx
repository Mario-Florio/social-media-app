import { useEffect, useState } from "react";
import "./settings.css";
import "./forms.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import GeneralTab from "./general/GeneralTab";
import UserTab from "./user/UserTab";
import { useParams } from "react-router-dom";

function Settings() {
    const { selected } = useParams();
    const [selectedTab, setSelectedTab] = useState( selected === "user" ?
        { component: <UserTab/>, value: "user" } : { component: <GeneralTab/>, value: "general" } );

    useEffect(() => {
        setSelectedTab( selected === "user" ?
        { component: <UserTab/>, value: "user" } : { component: <GeneralTab/>, value: "general" } );
    }, [selected]);

    return(
        <PageLayout>
            <section id="settings" className="main-component">
                <header>
                    <span
                        className={ selectedTab.value === "general" ? "isActive" : "" }
                        onClick={() => setSelectedTab({ component: <GeneralTab/>, value: "general" })}>General</span>
                    <span
                        className={ selectedTab.value === "user" ? "isActive" : "" }
                        onClick={() => setSelectedTab({ component: <UserTab/>, value: "user" })}>User</span>
                    <div/>
                </header>
                { selectedTab.component }
            </section>
        </PageLayout>
    );
}

export default Settings;