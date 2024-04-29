import "./viewPhotoSection.css";
import SectionWrapper from "./sectionWrapper/SectionWrapper";

function ViewPhotoSection({ photoData, sectionIsActive, setSectionIsActive, setDeleteSectionIsActive }) {
    return(
        <SectionWrapper
            sectionIsActive={sectionIsActive}
            setSectionIsActive={setSectionIsActive}
        >
            <div className="photo_wrapper">
                <img src={photoData.url} alt={photoData.name}/>
            </div>
            <h4>{photoData.name}</h4>
            <p>{photoData.caption}</p>
        </SectionWrapper>
    );
}

export default ViewPhotoSection;