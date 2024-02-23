import "./sectionWrapper.css";

function SectionWrapper({ sectionClassName, sectionIsActive, setSectionIsActive, children }) {
    return(
        <>
            <div className={ sectionIsActive ? "section_mask active" : "section_mask" }></div>
            <section className={ sectionIsActive ? `${sectionClassName} section active` : `${sectionClassName} section` }>
                <header>
                    <div
                        onClick={() => setSectionIsActive(false)}
                        className="close-icon_wrapper"
                    >
                        <div className="bar-1"></div>
                        <div className="bar-2"></div>
                    </div>
                </header>
                {children}
            </section>
        </>
    );
}

export default SectionWrapper;