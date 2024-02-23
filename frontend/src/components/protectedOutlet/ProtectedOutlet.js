import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { TimelineProvider } from "../../hooks/useTimeline";

function ProtectedOutlet() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return(
        <TimelineProvider>
            <Outlet/>
        </TimelineProvider>
    );
}

export default ProtectedOutlet;