import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Error404 from "../error404";
const RoleBasedRoute = (props) => {
    const userRole = useSelector(state => state.account.userProfile.role);
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    return userRole === "ROLE_ADMIN" && isAdminRoute ? props.children : <Error404 />;
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    return (
        <>
            {isAuthenticated ?
            <RoleBasedRoute>
                {props.children}
            </RoleBasedRoute>
            : <Navigate to="/login" replace />}
        </>
    )
}

export default ProtectedRoute;