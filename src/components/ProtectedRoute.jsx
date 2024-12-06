// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isConnected = window.ethereum && window.ethereum.selectedAddress;
    
    if (!isConnected) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;