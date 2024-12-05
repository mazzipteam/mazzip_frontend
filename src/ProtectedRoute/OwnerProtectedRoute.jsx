import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const OwnerProtectedRoute = ({ children }) => {
  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef(false);

  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/v1/user/${userId}`);
        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setUserRole(data.data.role);
      } catch (error) {
        console.error('사용자 정보 조회 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [userId]);

  useEffect(() => {
    if (!isLoading && !userId && !navigationRef.current) {
      alert('로그인이 필요한 서비스입니다.');
      navigationRef.current = true;
    } else if (!isLoading && userRole !== 'OWNER' && !navigationRef.current) {
      alert('점주만 접근 가능한 페이지입니다.');
      navigationRef.current = true;
    }
  }, [userId, userRole, isLoading, location]);

  if (isLoading) {
    return null;
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'OWNER') {
    return <Navigate to="/" replace />;
  }

  navigationRef.current = false;
  return children;
};

export default OwnerProtectedRoute;