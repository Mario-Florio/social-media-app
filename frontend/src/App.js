import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProtectedOutlet from "./components/protectedOutlet/ProtectedOutlet";
import EntryForm from "./pages/entry-form/EntryForm";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import PostPage from "./pages/post/Post";

function App() {
    return(
        <Routes>
            <Route path="/login" element={<EntryForm/>}/>
            <Route path="/" element={<ProtectedOutlet/>}>
                <Route path="" element={<Home/>}/>
                <Route path="profile/:id" element={<Profile/>}/>
                <Route path="post/:id" element={<PostPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;