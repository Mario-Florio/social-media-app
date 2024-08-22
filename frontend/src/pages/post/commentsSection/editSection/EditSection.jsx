import { useState } from "react";
import "./editSection.css";
import Loader from "../../../../components/loader/Loader";
import SectionWrapper from "../../../../components/sectionWrapper/SectionWrapper"
import requests from "../../../../serverRequests/methods/config";
import { useResponsePopup } from "../../../../hooks/useResponsePopup";
import { useAuth } from "../../../../hooks/useAuth";

const { putComment } = requests.comments;

function EditSection({ comment, setComments, editSectionIsActive, setEditSectionIsActive }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState(comment.text);
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();
    const { token } = useAuth();

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const update = {
            text: input,
        }

        const res = await putComment({ id: comment._id, update, token });

        if (res.success) {
            setInput(comment.text);
            setEditSectionIsActive(false);
            setComments(comments => [...comments.map(comment => comment._id === res.comment._id ? res.comment : comment)]);
        }

        setIsLoading(false);
        setResponsePopupData({ message: res.message, success: res.success });
        setResponsePopupIsActive(true);
    }

    return(
        <SectionWrapper
            sectionClassName="edit-section"
            sectionIsActive={editSectionIsActive}
            setSectionIsActive={setEditSectionIsActive}
        >
            <form onSubmit={handleSubmit}>
                <textarea value={input} onChange={handleChange}/>
                <div className="button_wrapper">
                    { isLoading && <Loader size={25}/> }
                    <button disabled={isLoading}>Submit</button>
                </div>
            </form>
        </SectionWrapper>
    );
}

export default EditSection;