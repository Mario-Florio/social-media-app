import { useEffect, useState } from "react";
import "./editAlbumForm.css";

function EditAlbumForm({ selectedAlbum }) {
    const [isActive, setIsActive] = useState(false);
    const [formInput, setFormInput] = useState({
        name: "",
        desc: ""
    });

    useEffect(() => {
        setFormInput({
            name: selectedAlbum.name,
            desc: selectedAlbum.desc
        });
    }, [selectedAlbum]);

    function handleChange(e) {
        setFormInput({
            ...formInput,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (formInput.name === selectedAlbum.name && formInput.desc === selectedAlbum.desc) {
            console.log("No Edits");
            return;
        }
        console.log(formInput);
        setIsActive(false);
    }

    return(
        <section className="edit-album-form">
            <span onClick={() => setIsActive(true)}>Edit</span>
            <div className={ isActive ? "form-popup_mask active" : "form-popup_mask" }>
                <div className="form-popup">
                    <button onClick={() => setIsActive(false)}>
                        <div className="bar vertical"/>
                        <div className="bar horizontal"/>
                    </button>
                    <form onSubmit={handleSubmit}>
                        <h3>Edit Album</h3>
                        <label htmlFor="name">Name</label><br/>
                        <input
                            name="name"
                            id="name"
                            value={formInput.name}
                            onChange={handleChange}
                            required={true}
                            minLength={3}
                            maxLength={25}
                        /><br/>
                        <label htmlFor="desc">Desc</label><br/>
                        <textarea
                            name="desc"
                            id="desc"
                            value={formInput.desc}
                            onChange={handleChange}
                            maxLength={250}
                        /><br/>
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default EditAlbumForm;