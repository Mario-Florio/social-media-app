import { useEffect, useState } from "react";
import "./App.css";
import EntryForm from "./pages/entry-form/EntryForm";
import Home from "./pages/home/Home";
import axios from "axios";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        localStorage.getItem("token") && getSession()
            .then(data => {
                if (data.success) {
                    setUser(data.authData.user);
                }
            })
            .catch(err => console.log(err));
    }, []);

    async function getSession() {
        // const config = {
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem("token")}`
        //     }
        // }
        // const session = await axios.get("/auth/session", config);
        // return session.data;
        return { success: true, authData: { user: { username: "moflow47", password: "password" } } }
    }

    return(user ?
        <Home user={user} setUser={setUser}/> :
        <EntryForm setUser={setUser}/>
    );
}

export default App;