
function validateToken(token) {
    const storedTokenJSON = window.localStorage.getItem("token");
    const storedToken = JSON.parse(storedTokenJSON);
    if (storedToken !== token) {
        return false;
    } else {
        return true;
    }
}

export default validateToken;