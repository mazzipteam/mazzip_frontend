import React from 'react';
import NavBar from '../NavBar/NavBar'; // 상단바 추가
import styles from './Notification.module.css';

function Notification() {
    const notifications = [
        { id: 1, text: '멘야준 예약 성공!', type: 'success' },
        { id: 2, text: '희옥 예약 실패..', type: 'failure' },
        { id: 3, text: '헤키 쿠폰 발급!', type: 'success' },
        { id: 4, text: '반라이 예약 성공!', type: 'success' },
        { id: 5, text: '오레노라멘 쿠폰 발급!', type: 'success' },
    ];

    return (
        <div className={styles.notificationPage}>
            <NavBar /> {/* 상단바 추가 */}
            <div className={styles.notificationContent}>
                <h2 className={styles.notificationTitle}>알림센터</h2>
                <span className={styles.checkAll}>모든 알림 확인</span>
                <div className={styles.notificationList}>
                    {notifications.map((notification) => (
                        <div key={notification.id} className={styles.notificationItem}>
                            <span className={styles.statusIcon}>{notification.type === 'success' ? '🔵' : '🔴'}</span>
                            <span className={styles.notificationText}>{notification.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notification;
