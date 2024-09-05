import { useState, useEffect } from "react";
import "./likesSection.css";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import SectionWrapper from "../../sectionWrapper/SectionWrapper";

import requests from "../../../serverRequests/requests";
const { getUsers } = requests.users;

function LikesSection({ postId, likeIds, likesSectionIsActive, setLikesSectionIsActive }) {
    const [likes, setLikes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const queryBody = {
                    populate: {
                        model: "Post",
                        _id: postId,
                        fields: ["likes"]
                    }
                };
                const res = await getUsers({ queryBody });
                if (res.success) {
                    setLikes(res.users);
                } else {
                    setResponsePopupData({ message: res.message, success: res.success });
                    setResponsePopupIsActive(true);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [postId, likeIds]);

    return(
        <SectionWrapper
            sectionClassName="likes-section"
            sectionIsActive={likesSectionIsActive}
            setSectionIsActive={setLikesSectionIsActive}
        >
            <ul>
                { isLoading ?
                    likeIds.map(likeId => 
                        <li key={likeId}>
                            <div className="profile_wrapper">
                                <div className="loadingBGColor profile-pic_wrapper"></div>
                                <div className="loadingBGColor" style={{ height: "1rem", width: "40%", borderRadius: "5px" }}></div>
                            </div>
                        </li>
                    )
                        :
                    likes.map(like =>
                        <li key={like._id}>
                            <Link 
                                to={`/users/${like._id}`}
                                onClick={() => setLikesSectionIsActive(false)}
                            >
                                <div className="profile_wrapper">
                                    <div className="profile-pic_wrapper">
                                        <ImgHandler src={photoExists(like.profile.picture)} type="profile"/>
                                    </div>
                                    <h3>{like.username}</h3>
                                </div>
                            </Link>
                        </li>
                    ) }
            </ul>
        </SectionWrapper>
    );
}

export default LikesSection;