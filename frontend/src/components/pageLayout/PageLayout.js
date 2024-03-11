import { useState } from "react";
import Topbar from "../topbar/Topbar";
import SideMenu from "../sidemenu/SideMenu";
import RightSideMenu from "../rightSideMenu/rightSideMenu";
import { ThemeProvider } from "../../hooks/useTheme/useTheme";

function PageLayout({ children }) {
    const [sideMenuIsActive, setSideMenuIsActive] = useState(false);
    const [rightSideMenuIsActive, setRightSideMenuIsActive] = useState(false);

    return (
        <ThemeProvider>
            <Topbar
                sideMenuIsActive={sideMenuIsActive}
                setSideMenuIsActive={setSideMenuIsActive}
                rightSideMenuIsActive={rightSideMenuIsActive}
                setRightSideMenuIsActive={setRightSideMenuIsActive}
            />
            <main>
                <SideMenu sideMenuIsActive={sideMenuIsActive} setSideMenuIsActive={setSideMenuIsActive}/>
                {children}
                <RightSideMenu rightSideMenuIsActive={rightSideMenuIsActive} setRightSideMenuIsActive={setRightSideMenuIsActive}/>
            </main>
        </ThemeProvider>
    );
}

export default PageLayout;