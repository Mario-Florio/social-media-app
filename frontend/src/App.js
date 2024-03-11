import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProtectedOutlet from "./components/protectedOutlet/ProtectedOutlet";
import EntryForm from "./pages/entry-form/EntryForm";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import PostPage from "./pages/post/Post";
import { TimelineProvider } from "./hooks/useTimeline";

function App() {
    return(
        <Routes>
            <Route path="/login" element={<EntryForm/>}/>
            <Route path="/" element={<ProtectedOutlet/>}>
                <Route path="" element={<TimelineProvider><Home/></TimelineProvider>}/>
                <Route path="profile/:id" element={<TimelineProvider><Profile/></TimelineProvider>}/>
                <Route path="post/:id" element={<TimelineProvider><PostPage/></TimelineProvider>}/>
            </Route>
        </Routes>
    );
}

export default App;