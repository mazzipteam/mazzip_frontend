import React, { useState, useEffect } from 'react';
import styles from './AvatarPage.module.css';

function AvatarPage() {
    const [hatImages, setHatImages] = useState([]); // 모자 이미지 리스트
    const [selectedHat, setSelectedHat] = useState(null); // 선택된 모자
    const [reservationCount, setReservationCount] = useState(0); // 예약 개수 상태 추가
    const [avatarId, setAvatarId] = useState(null);
    const userId = localStorage.getItem('userId'); // 로컬스토리지에서 사용자 ID 가져오기

    //유저 아이디로 예약횟수 가져오기. 가져온 예약횟수는 reservationCount에 저장됨.
    useEffect(() => {
        // API 호출: 예약 데이터 가져오기
        if (userId) {
            fetch(`http://localhost:8080/api/v1/reservation/all/user/${userId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('예약 데이터를 가져오는 데 실패했습니다.');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data && data.data) {
                        // DONE 상태의 예약 개수 계산
                        const doneCount = data.data.filter(
                            (reservation) => reservation.state === 'DONE'
                        ).length;
                        setReservationCount(doneCount); // 상태 업데이트
                        console.log(`예약개수 카운트 ${doneCount}`);
                    }
                })
                .catch((error) => {
                    console.error('예약 정보를 가져오는 중 오류 발생:', error);
                });
        } else {
            console.error('사용자 ID를 로컬스토리지에서 가져오지 못했습니다.');
        }
    }, [userId]);

    useEffect(() => {
        // 유저 아이디로 아바타 정보 가져오기
        if (userId) {
            fetch(`http://localhost:8080/api/v1/avatar/user/${userId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('아바타 데이터를 가져오는 데 실패했습니다.');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data && data.data) {
                        setAvatarId(data.data.avatarId); // 아바타 ID 상태 업데이트
                        console.log(`아바타 ID: ${avatarId}`);
                    }
                })
                .catch((error) => {
                    console.error('아바타 정보를 가져오는 중 오류 발생:', error);
                });
        } else {
            console.error('유저 ID를 로컬스토리지에서 가져오지 못했습니다.');
        }
    }, [userId]); // userId가 변경될 때마다 실행

    //db로부터 모든 의상정보 가져오기
    useEffect(() => {
        // API 호출: 모든 의상 정보 가져오기
        fetch('http://localhost:8080/api/v1/clothes/all')
            .then((response) => {
                if (!response.ok) throw new Error('의상 정보를 가져오는 데 실패했습니다.');
                return response.json();
            })
            .then((data) => {
                if (data && data.data) {
                    const imagePaths = data.data.map((item) => (item.image)); // 이미지 경로 추출
                    setHatImages(imagePaths);
                }
            })
            .catch((error) => console.error('의상 정보를 가져오는 중 오류 발생:', error));
    }, []);
    
    useEffect(() => {
        if (avatarId && reservationCount >= 0) {
            // 업데이트할 데이터 객체 생성
            const updateData = {
                avatarId: avatarId,
                level: reservationCount.toString(), // reservationCount를 문자열로 변환하여 level로 설정
            };
    
            // API 호출: 아바타 레벨 업데이트
            fetch('http://localhost:8080/api/v1/avatar', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('레벨 업데이트 실패');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('레벨 업데이트 성공:', data);
                })
                .catch((error) => {
                    console.error('레벨 업데이트 중 오류 발생:', error);
                });
        }
    }, [reservationCount, avatarId]); // reservationCount나 avatarId가 변경될 때 실행

    const handleHatClick = (hatIndex) => {
        // 예약 개수 이하 모자만 클릭 가능
        if (hatIndex < reservationCount) {
            setSelectedHat(hatImages[hatIndex]);
        } else {
            alert(`${hatIndex + 1}번째 모자는 ${hatIndex + 1}번째 예약 후 잠금 해제됩니다.`);
        }
        console.log(avatarId);
    };

    const handleClearHat = () => {
        setSelectedHat(null); // 선택된 모자 초기화
    };

    return (
        <div className={styles.avatarPage}>
            <h2 className={styles.avatarTitle}>아바타 키우기</h2>
            <div className={styles.avatarContainer}>
                <div className={styles.avatarItems}>
                    {hatImages.map((image, index) => (
                        <div
                            key={index}
                            className={`${styles.avatarItem} ${
                                index < reservationCount
                                    ? ''
                                    : styles.lockedHat // 예약 개수 초과 시 잠금 스타일
                            }`}
                            onClick={() => handleHatClick(index)}
                        >
                            <img src={`data:image/png;base64,${image}`} alt={`Hat ${index + 1}`} />
                            {index >= reservationCount && (
                                <div className={styles.lockedOverlay}>
                                    {index + 1}번째 예약 시 잠금해제
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.avatarDisplay}>
                    <img
                        src="/아바타샘플.jpg"
                        alt="Avatar"
                        className={styles.avatarImage}
                    />
                    {selectedHat && (
                        <img
                            src={`data:image/png;base64,${selectedHat}`}
                            alt="Selected Hat"
                            className={styles.selectedHat}
                        />
                    )}
                    <div className={styles.avatarActions}>
                        <button className={styles.actionButton} onClick={handleClearHat}>
                            모두벗기
                        </button>
                        <button className={styles.actionButton}>적용하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvatarPage;

