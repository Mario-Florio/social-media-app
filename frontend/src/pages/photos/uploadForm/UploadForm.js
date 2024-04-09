import { useState } from "react";
import "./uploadForm.css";

function UploadForm() {
    const [isActive, setIsActive] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Do something with formData
        e.target.reset();
    }

    return(
        <div className={ isActive ? "photo-upload-form_wrapper active" : "photo-upload-form_wrapper inactive" }>
            <button onClick={() => setIsActive(!isActive)}>
                <div className="bar vertical"/>
                <div className="bar horizontal"/>
            </button>
            { isActive && <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h3>Upload Photo</h3>
                <label htmlFor="name">Name</label><br/>
                <input name="name" id="name" maxLength={25}/><br/>
                <label htmlFor="image">Img File</label><br/>
                <input type="file" name="image" id="image" accept="image/*" required={true}/><br/>
                <label htmlFor="caption">Caption</label><br/>
                <textarea name="caption" id="caption" maxLength={250}/><br/>
                <button>Upload</button>
            </form> }
        </div>
    );
}

export default UploadForm;