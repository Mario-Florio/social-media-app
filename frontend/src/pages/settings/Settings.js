import { useEffect, useState } from "react";
import "./settings.css";
import "./forms.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import GeneralForm from "./general/Form";
import UserForm from "./user/Form";
import ProfileForm from "./profile/Form";
import { useParams } from "react-router-dom";

function Settings() {
    const { selected } = useParams();
    const [selectedForm, setSelectedForm] = useState( selected === "user" ?
        { component: <UserForm/>, value: "user" } : selected === "profile" ?
        { component: <ProfileForm/>, value: "profile" } : { component: <GeneralForm/>, value: "general" } );

    useEffect(() => {
        setSelectedForm( selected === "user" ?
        { component: <UserForm/>, value: "user" } : selected === "profile" ?
        { component: <ProfileForm/>, value: "profile" } : { component: <GeneralForm/>, value: "general" } );
    }, [selected]);

    return(
        <PageLayout>
            <section id="settings" className="main-component">
                <header>
                    <span
                        className={ selectedForm.value === "general" ? "isActive" : "" }
                        onClick={() => setSelectedForm({ component: <GeneralForm/>, value: "general" })}>General Settings</span>
                    <span
                        className={ selectedForm.value === "user" ? "isActive" : "" }
                        onClick={() => setSelectedForm({ component: <UserForm/>, value: "user" })}>User Settings</span>
                    <span
                        className={ selectedForm.value === "profile" ? "isActive" : "" }
                        onClick={() => setSelectedForm({ component: <ProfileForm/>, value: "profile" })}>Profile Settings</span>
                    <div/>
                </header>
                { selectedForm.component }
            </section>
        </PageLayout>
    );
}

export default Settings;