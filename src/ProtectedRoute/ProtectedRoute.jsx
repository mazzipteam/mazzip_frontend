
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const navigationRef = useRef(false);
  
  useEffect(() => {
    if (!userId && !navigationRef.current) {
      alert('로그인이 필요한 서비스입니다.');
      navigationRef.current = true;
    }
  }, [userId, location]);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  navigationRef.current = false;
  return children;
};

export default ProtectedRoute;