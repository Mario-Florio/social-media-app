import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedOutlet() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return(
        <Outlet/>
    );
}

export default ProtectedOutlet;