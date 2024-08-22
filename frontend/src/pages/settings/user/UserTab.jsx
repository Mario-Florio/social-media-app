import AccountForm from "./account/Form";
import ProfileForm from "./profile/Form";

function UserTab() {

    return(
        <section className="user-tab">
            <AccountForm/>
            <ProfileForm/>
        </section>
    );
}

export default UserTab;