import React, { useEffect, useState } from 'react';
import './MyReservationListPage.css';

const MyReservationListPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로컬스토리지에서 userId 가져오기
  const userId = localStorage.getItem('userId') || 1; // 로컬스토리지에 userId가 없으면 기본값 1

  useEffect(() => {
    // 샘플 데이터셋
    const sampleReservations = [
      {
        reservationId: 1,
        restaurant: { name: 'Sample Restaurant 1' },
        time: '2024-12-10T18:00:00',
        people: 4,
        state: 'NOT_YET',
      },
      {
        reservationId: 2,
        restaurant: { name: 'Sample Restaurant 2' },
        time: '2024-12-12T19:30:00',
        people: 2,
        state: 'DONE',
      },
      {
        reservationId: 3,
        restaurant: { name: 'Sample Restaurant 3' },
        time: '2024-12-15T20:00:00',
        people: 3,
        state: 'CANCEL',
      },
    ];

    // API 요청 주석 처리
    /*
    const fetchReservations = async () => {
      try {
        const response = await fetch(`/api/v1/reservation/all/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        setReservations(data.data); // CommonResponse에서 data 필드에 접근
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
    */

    // 샘플 데이터 사용
    setReservations(sampleReservations);
    setIsLoading(false);
  }, [userId]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="reservation-list-container">
      <h1>My Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul className="reservation-list">
          {reservations.map((reservation) => (
            <li key={reservation.reservationId} className="reservation-item">
              <div className="reservation-details">
                <p><strong>식당명:</strong> {reservation.restaurant.name}</p>
                <p><strong>날짜/시간:</strong> {new Date(reservation.time).toLocaleString()}</p>
                <p><strong>예약인원:</strong> {reservation.people}</p>
                <p><strong>상태:</strong> {reservation.state}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReservationListPage;

