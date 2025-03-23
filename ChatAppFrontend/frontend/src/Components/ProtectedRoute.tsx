import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ReactNode } from "react";


export default function ProtectedRoute({children}: {children: ReactNode}) {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? children : <Navigate to="/"/>
}