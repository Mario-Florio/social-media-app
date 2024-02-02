import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProtectedOutlet from "./components/protectedOutlet/ProtectedOutlet";
import EntryForm from "./pages/entry-form/EntryForm";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

function App() {
    return(
        <Routes>
            <Route path="/login" element={<EntryForm/>}/>
            <Route path="/" element={<ProtectedOutlet/>}>
                <Route path="" element={<Home/>}/>
                <Route path="profile" element={<Profile/>}/>
            </Route>
        </Routes>
    );
}

export default App;