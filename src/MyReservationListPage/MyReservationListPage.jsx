import React, { useEffect, useState } from 'react';
import './MyReservationListPage.css';

const MyReservationListPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL;

  // 로컬스토리지에서 userId 가져오기
  const userId = localStorage.getItem('userId') || 1;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/reservation/all/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const responseData = await response.json();
        
        if (responseData.code === 200) {
          setReservations(responseData.data);
        } else {
          throw new Error(responseData.message || 'Failed to fetch reservations');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching reservations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchReservations();
    } else {
      setError('로그인이 필요합니다.');
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const getStateText = (state) => {
    switch (state) {
      case 'NOT_YET':
        return '예약 대기';
      case 'DONE':
        return '방문 완료';
      case 'CANCEL':
        return '예약 취소';
      default:
        return state;
    }
  };

  return (
    <div className="reservation-list-container">
      <h1>나의 예약 내역</h1>
      {reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <ul className="reservation-list">
          {reservations.map((reservation) => {
            // 이미지 처리 로직
            const emptyImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
            const restaurantImage = reservation.restaurant.restaurantImage?.foreGround
              ? `data:image/png;base64,${reservation.restaurant.restaurantImage.foreGround}`
              : `data:image/png;base64,${emptyImageBase64}`;
  
            return (
              <li key={reservation.reservationId} className="reservation-item">
                  <div className="restaurant-image">
                    <img 
                      src={restaurantImage} 
                      alt={reservation.restaurant.name}
                      className="restaurant-thumbnail"
                    />
                  </div>
                  <div className="reservation-details">
                  <p><strong>예약 번호:</strong> {reservation.reservationId}</p>
                  <p><strong>식당명:</strong> {reservation.restaurant.name}</p>
                  <p><strong>식당 주소:</strong> {reservation.restaurant.address}</p>
                  <p><strong>식당 연락처:</strong> {reservation.restaurant.telNum}</p>
                  <p><strong>예약 날짜/시간:</strong> {new Date(reservation.time).toLocaleString()}</p>
                  <p><strong>예약 인원:</strong> {reservation.people}명</p>
                  <p><strong>예약 상태:</strong> {getStateText(reservation.state)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyReservationListPage;