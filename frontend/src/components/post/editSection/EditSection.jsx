import { useState } from "react";
import "./editSection.css";
import { useAuth } from "../../../hooks/useAuth";
import { useResponsePopup } from "../../../hooks/useResponsePopup";
import SectionWrapper from "../../sectionWrapper/SectionWrapper";
import Loader from "../../loader/Loader";

import requests from "../../../serverRequests/requests";
const { putPost } = requests.posts;

function EditSection({ post, editSectionIsActive, setEditSectionIsActive, setPost }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState(post.text);
    const { token } = useAuth();
    const { setResponsePopupIsActive, setResponsePopupData } = useResponsePopup();

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const updatedPostFields = {
            text: input,
        }

        const res = await putPost({ id: post._id, update: updatedPostFields, token });

        if (res.success) {
            setInput(post.text);
            setEditSectionIsActive(false);
            setPost(res.post);
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

export default EditSection