import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../services/api';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await authApi.getCurrentAdmin();
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
