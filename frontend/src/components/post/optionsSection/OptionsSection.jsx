import { useState } from "react";
import "./optionsSection.css";
import { useAuth } from "../../../hooks/useAuth";
import { usePosts } from "../../../hooks/usePosts";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import SectionWrapper from "../../sectionWrapper/SectionWrapper";
import { Link } from "react-router-dom";

import requests from "../../../serverRequests/requests";

function OptionsSection({ likePost, post, optionsSectionIsActive, setOptionsSectionIsActive, setEditSectionIsActive }) {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDeletePopupIsActive, setConfirmDeletePopupIsActive] = useState(false)
    const { user, token } = useAuth();
    const { posts, setPosts } = usePosts();
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

    async function deletePost() {
        setIsLoading(true);

        const res = await requests.posts.deletePost({ id: post._id, token });

        if (res.success) {
            const filteredPosts = posts.filter(p => p._id !== post._id);
            setPosts(filteredPosts);
            setConfirmDeletePopupIsActive(false);
            setOptionsSectionIsActive(false);
        }

        setIsLoading(false);
        setResponsePopupData({ message: res.message, success: res.success });
        setResponsePopupIsActive(true);
    }

    async function editPost() {
        setEditSectionIsActive(true);
        setOptionsSectionIsActive(false);
    }

    return(
        <SectionWrapper
            sectionClassName="options-section"
            sectionIsActive={optionsSectionIsActive}
            setSectionIsActive={setOptionsSectionIsActive}
        >
            <ul>
                { post.user._id === user._id && <li onClick={() => setConfirmDeletePopupIsActive(true)}>Delete Post</li> }
                { post.user._id === user._id && <li onClick={async () => await editPost()}>Edit Post</li> }
                <li onClick={async () => await likePost()}>
                    { post.likes.includes(user._id) ? "Unlike Post" : "Like Post" }
                </li>
                <Link to={post._id && `/post/${post._id}`}>
                    <li>
                        View Comments
                    </li>
                </Link>
            </ul>
            <div className={confirmDeletePopupIsActive ? "popup_mask active" : "popup_mask"}>
                <div className="confirm-delete_popup">
                    <p>Are you sure you want to delete this post?</p>
                    <button disabled={isLoading} onClick={async () => await deletePost()}>Confirm</button>
                    <button disabled={isLoading} onClick={() => setConfirmDeletePopupIsActive(false)}>Cancel</button>
                </div>
            </div>
        </SectionWrapper>
    );
}

export default OptionsSection;