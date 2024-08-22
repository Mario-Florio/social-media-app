import { useState } from "react";
import "./optionsSection.css";
import SectionWrapper from "../../../../components/sectionWrapper/SectionWrapper";
import requests from "../../../../serverRequests/methods/config";

import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useAuth } from "../../../../hooks/useAuth";

const { deleteComment } = requests.comments;

function OptionsSection({ comment, setComments, optionsSectionIsActive, setOptionsSectionIsActive, setEditSectionIsActive }) {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDeletePopupIsActive, setConfirmDeletePopupIsActive] = useState(false);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { user, token } = useAuth();

    async function removeComment() {
        setIsLoading(true);

        const res = await deleteComment({ id: comment._id, token });
        if (res.success) {
            setComments(comments => [...comments.filter(c => c._id !== comment._id)]);
            setConfirmDeletePopupIsActive(false);
            setOptionsSectionIsActive(false);
        }
        setIsLoading(false);
        setResponsePopupData({ message: res.message, success: res.success });
        setResponsePopupIsActive(true);
    }

    async function editComment() {
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
                { comment.user._id === user._id && <li onClick={() => setConfirmDeletePopupIsActive(true)}>Delete Comment</li> }
                { comment.user._id === user._id && <li onClick={async () => await editComment()}>Edit Comment</li> }
            </ul>
            <div className={confirmDeletePopupIsActive ? "popup_mask active" : "popup_mask"}>
                <div className="confirm-delete_popup">
                    <p>Are you sure you want to delete this post?</p>
                    <button disabled={isLoading} onClick={async () => await removeComment()}>Confirm</button>
                    <button disabled={isLoading} onClick={() => setConfirmDeletePopupIsActive(false)}>Cancel</button>
                </div>
            </div>
        </SectionWrapper>
    );
}

export default OptionsSection;