import CustomThemeForm from "./customTheme/Form";
import DarkModeThemeForm from "./darkModeTheme/Form";

function GeneralTab() {

    return(
        <section className="general-tab">
            <CustomThemeForm/>
            <DarkModeThemeForm/>
        </section>
    );
}

export default GeneralTab;