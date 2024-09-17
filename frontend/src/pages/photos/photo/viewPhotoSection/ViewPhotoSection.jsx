import "./viewPhotoSection.css";
import ImgHandler from "../../../../components/imgHandler/ImgHandler";
import photoExists from "../../../../components/imgHandler/__utils__/photoExists";
import SectionWrapper from "./sectionWrapper/SectionWrapper";

function ViewPhotoSection({ photoData, sectionIsActive, setSectionIsActive, setDeleteSectionIsActive }) {
    return(
        <SectionWrapper
            sectionIsActive={sectionIsActive}
            setSectionIsActive={setSectionIsActive}
        >
            <div className="photo_wrapper">
                <ImgHandler src={photoExists(photoData)} type="photo"/>
            </div>
            <h4>{photoData.name}</h4>
            <p>{photoData.caption}</p>
        </SectionWrapper>
    );
}

export default ViewPhotoSection;