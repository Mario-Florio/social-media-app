import "./profile.css";
import PageLayout from "../../components/pageLayout/PageLayout";
import Timeline from "../../components/timeline/Timeline";

import coverPhoto from "../../assets/imgs/cover-photo.jpg";
import jesus from "../../assets/imgs/jesus.jpg"

function Profile() {
    return(
        <PageLayout>
            <section className="profileTop">
                <img src={coverPhoto} alt="cover photo" className="coverPhoto"/>
                <img src={jesus} alt="profile picture" className="profilePic"/>
            </section>
            <Timeline/>
        </PageLayout>
    );
}

export default Profile;