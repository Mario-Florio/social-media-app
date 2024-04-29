import { useEffect, useState } from "react";
import "./sectionWrapper.css";

function SectionWrapper({ sectionClassName, sectionIsActive, setSectionIsActive, children }) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (sectionIsActive) setTimeout(() => setIsActive(true), 50);
    }, [sectionIsActive]);

    function handleClick() {
        setIsActive(false);
        setTimeout(() => setSectionIsActive(false), 50);
    }

    return(
        <>
            <div className={ isActive ? "section_mask active" : "section_mask" }></div>
            <section className={ isActive ? `${sectionClassName} section active` : `${sectionClassName} section` }>
                <header>
                    <div
                        onClick={handleClick}
                        className="close-icon_wrapper"
                    >
                        <div className="bar-1"></div>
                        <div className="bar-2"></div>
                    </div>
                </header>
                <div className="children_wrapper">
                    {children}
                </div>
            </section>
        </>
    );
}

export default SectionWrapper;