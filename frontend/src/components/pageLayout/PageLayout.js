import { useState } from "react";
import Topbar from "../topbar/Topbar";
import SideMenu from "../sidemenu/SideMenu";

function PageLayout({ children }) {
    const [sideMenuIsActive, setSideMenuIsActive] = useState(false);

    return (
        <>
            <Topbar sideMenuIsActive={sideMenuIsActive} setSideMenuIsActive={setSideMenuIsActive}/>
            <main>
                <SideMenu sideMenuIsActive={sideMenuIsActive} setSideMenuIsActive={setSideMenuIsActive}/>
                {children}
            </main>
        </>
    );
}

export default PageLayout;