import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const isAuthenticated = localStorage.getItem('token') !== null; // Check if user is authenticated
    const userRole = localStorage.getItem('role'); // Get user role

    if (!isAuthenticated) {
        // If user is not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        // If user doesn't have the required role, redirect to unauthorized page
        // You might want to create an Unauthorized component for this
        return <Navigate to="/unauthorized" replace />;
    }

    // If user is authenticated and authorized, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;