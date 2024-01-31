
function Logout({ setUser }) {
    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return(
        <button onClick={logout}>Logout</button>
    );
}

export default Logout;