import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element}) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/signin" state={{ from: location }} replace />
    }

    return children;
}