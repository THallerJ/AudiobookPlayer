import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ doRedirect, redirect, children }) => {
	return doRedirect ? <Navigate to={redirect} /> : children;
};

export default ProtectedRoute;
