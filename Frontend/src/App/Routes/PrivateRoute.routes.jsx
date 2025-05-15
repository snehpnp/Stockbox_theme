
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("Role");

    if (!token) {
        return <Navigate to="/user-login" replace />;
    }

    if (!allowedRoles.includes(role)) {

        switch (role) {
            case "SUPERADMIN":
                return <Navigate to="/superadmin/company" replace />;
            case "ADMIN":
                return <Navigate to="/admin/dashboard" replace />;
            case "USER":
                return <Navigate to="/user/dashboard" replace />;
            case "EMPLOYEE":
                return <Navigate to="/employee/dashboard" replace />;
            default:
                return <Navigate to="/user-login" replace />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;
