
function GeneralForm() {

    function handleSubmit(e) {
        e.preventDefault();
    }

    return(
        <form onSubmit={handleSubmit}>
            <button>Submit</button>
        </form>
    );
}

export default GeneralForm;