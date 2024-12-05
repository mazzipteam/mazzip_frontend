import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar'; // 상단바 추가
import styles from './Notification.module.css';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // 알림 조회 API 호출
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://43.201.45.105:8080/api/v1/notice/all/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }
                const data = await response.json();
                setNotifications(data.data || []); // 데이터가 없으면 빈 배열로 초기화
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchNotifications();
        } else {
            setError('User ID not found');
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.notificationPage}>
            <NavBar /> {/* 상단바 추가 */}
            <div className={styles.notificationContent}>
                <h2 className={styles.notificationTitle}>알림센터</h2>
                <span className={styles.checkAll}>모든 알림 확인</span>
                <div className={styles.notificationList}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.noticeId} className={styles.notificationItem}>
                                <span className={styles.statusIcon}>
                                    {notification.bookmark?.restaurant?.name ? '🔵' : '🔴'}
                                </span>
                                <span className={styles.notificationText}>
                                    {notification.message || '알림 내용 없음'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noNotifications}>알림이 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notification;
