import { useState } from "react";
import Topbar from "./topbar/Topbar";
import SideMenu from "./sidemenu/SideMenu";
import DropDownMenu from "./dropDownMenu/DropDownMenu";
import { ThemeProvider } from "../../hooks/useTheme/useTheme";

function PageLayout({ children }) {
    const [sideMenuIsActive, setSideMenuIsActive] = useState(false);
    const [dropDownMenuIsActive, setDropDownMenuIsActive] = useState(false);

    return (
        <ThemeProvider>
            <Topbar
                sideMenuIsActive={sideMenuIsActive}
                setSideMenuIsActive={setSideMenuIsActive}
                dropDownMenuIsActive={dropDownMenuIsActive}
                setDropDownMenuIsActive={setDropDownMenuIsActive}
            />
            <DropDownMenu dropDownMenuIsActive={dropDownMenuIsActive} setDropDownMenuIsActive={setDropDownMenuIsActive}/>
            <main onClick={() => setDropDownMenuIsActive(false)}>
                <SideMenu sideMenuIsActive={sideMenuIsActive} setSideMenuIsActive={setSideMenuIsActive}/>
                {children}
            </main>
        </ThemeProvider>
    );
}

export default PageLayout;