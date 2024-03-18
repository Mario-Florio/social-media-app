import "./stylesheets/App.css";
import "./stylesheets/variables.css";
import "./stylesheets/scrollbar.css";
import { Routes, Route } from "react-router-dom";
import ProtectedOutlet from "./components/protectedOutlet/ProtectedOutlet";
import EntryForm from "./pages/entry-form/EntryForm";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import PostPage from "./pages/post/Post";
import Settings from "./pages/settings/Settings";

function App() {
    return(
        <Routes>
            <Route path="/login" element={<EntryForm/>}/>
            <Route path="/" element={<ProtectedOutlet/>}>
                <Route path="" element={<Home/>}/>
                <Route path="users/:id" element={<Profile/>}/>
                <Route path="post/:id" element={<PostPage/>}/>
                <Route path="settings/" element={<Settings/>}>
                    <Route path=":selected" element={<Settings/>}/>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;