import { useEffect, useState } from "react";
import "./photo.css";
import DeleteSection from "./deleteSection/DeleteSection";
import ViewPhotoSection from "./viewPhotoSection/ViewPhotoSection";
import SectionWrapper from "../../../components/sectionWrapper/SectionWrapper";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

function Photo({ data, albums, setAlbums, selectedAlbum, setSelectedAlbum, setPhotos }) {
    const [maskIsActive, setMaskIsActive] = useState(false);
    const [viewPhotoSectionIsActive, setViewPhotoSectionIsActive] = useState(false);
    const [optionsSectionIsActive, setOptionsSectionIsActive] = useState(false);
    const [deleteSectionIsActive, setDeleteSectionIsActive] = useState(false);

    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        deleteSectionIsActive && setOptionsSectionIsActive(false);
    }, [deleteSectionIsActive]);

    return(
        <li>
            <div className="img_wrapper">
                <img src={data.url} alt={data.name}/>
            </div>
            <div
                className={maskIsActive ? "photo_mask active" : "photo_mask"}
                onMouseEnter={() => setMaskIsActive(true)}
                onMouseLeave={() => setMaskIsActive(false)}
                onClick={() => setViewPhotoSectionIsActive(true)}
            >
                <div className="flexbox">
                    <h3>{data.name}</h3>
                    { id === user._id && <OptionsButton setOptionsSectionIsActive={setOptionsSectionIsActive}/> }
                </div>
                <div className="caption_wrapper">
                    <p>{data.caption}</p>
                </div>
            </div>
            { viewPhotoSectionIsActive &&
                <ViewPhotoSection
                    photoData={data}
                    sectionIsActive={viewPhotoSectionIsActive}
                    setSectionIsActive={setViewPhotoSectionIsActive}
                /> }
            { optionsSectionIsActive &&
                <OptionsSection
                    sectionIsActive={optionsSectionIsActive}
                    setSectionIsActive={setOptionsSectionIsActive}
                    setDeleteSectionIsActive={setDeleteSectionIsActive}
                /> }
            { deleteSectionIsActive &&
                <DeleteSection
                    data={data}
                    albums={albums}
                    setAlbums={setAlbums}
                    selectedAlbum={selectedAlbum}
                    setSelectedAlbum={setSelectedAlbum}
                    setPhotos={setPhotos}
                    sectionIsActive={deleteSectionIsActive}
                    setSectionIsActive={setDeleteSectionIsActive}
                /> }
        </li>
    );
}

export default Photo;

function OptionsButton({ setOptionsSectionIsActive }) {
    return(
        <div
            className="options"
            onClick={() => setOptionsSectionIsActive(true)}
        >
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

function OptionsSection({ sectionIsActive, setSectionIsActive, setDeleteSectionIsActive }) {
    return(
        <SectionWrapper
            sectionClassName={"photo-options-section"}
            sectionIsActive={sectionIsActive}
            setSectionIsActive={setSectionIsActive}
        >
            <ul>
                <li onClick={() => setDeleteSectionIsActive(true)}>Delete</li>
            </ul>
        </SectionWrapper>
    );
}
