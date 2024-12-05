import React, { useState, useEffect } from 'react';
import styles from './AvatarPage.module.css';

function AvatarPage() {
    const [hatImages, setHatImages] = useState([]); // 모자 이미지 리스트
    const [selectedHat, setSelectedHat] = useState(null); // 선택된 모자
    const [reservationCount, setReservationCount] = useState(0); // 예약 개수 상태 추가
    const [avatarId, setAvatarId] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState();
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

    useEffect(() => {
        if (avatarId) {
            fetch(`http://localhost:8080/api/v1/myClothes/all/${avatarId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('내 의상 데이터를 가져오는 데 실패했습니다.');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data && data.data) {
                        // 착용 여부가 'Y'인 의상 데이터 필터링
                        const wornClothes = data.data.find((clothes) => clothes.wear === 'Y');
                        if (wornClothes) {
                            setSelectedHat(wornClothes.clothes.image); // 착용 중인 모자 이미지 설정
                        }
                        console.log(wornClothes);
                    }
                })
                .catch((error) => console.error('내 의상 데이터를 가져오는 중 오류 발생:', error));
        }
    }, [avatarId]);

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

    const handleHatClick = (hatIndex) => {
        // 예약 개수 이하 모자만 클릭 가능
        if (hatIndex < reservationCount) {
            setSelectedHat(hatImages[hatIndex]);
        } else {
            alert(`${hatIndex + 1}번째 모자는 ${hatIndex + 1}번째 예약 후 잠금 해제됩니다.`);
        }
        setSelectedIndex(hatIndex);
    };

    const handleClearHat = () => {
        setSelectedHat(null); // 선택된 모자 초기화
    };

    const handleApplyHat = async () => {
        if (!selectedHat) {
            alert('적용할 모자를 선택하세요.');
            return;
        }
    
        if (!avatarId) {
            alert('아바타 ID를 가져오지 못했습니다.');
            return;
        }
    
        try {
            const clothesId = selectedIndex + 1; // 의상의 ID로 변환 (API 설계에 맞게 조정 필요)
    
            const response = await fetch(
                `http://localhost:8080/api/v1/myClothes/wear/${clothesId}/${avatarId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    
            if (!response.ok) {
                throw new Error('의상 적용에 실패했습니다.');
            }
    
            const data = await response.json();
            alert('의상이 성공적으로 적용되었습니다!');
            console.log('적용된 의상:', data);
    
            // 선택된 모자 상태를 업데이트 (서버 응답 데이터를 기반으로)
            setSelectedHat(selectedHat);
    
        } catch (error) {
            console.error('의상 적용 중 오류 발생:', error);
            alert('의상을 적용하는 중 문제가 발생했습니다.');
        }
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
                        <button className={styles.actionButton} onClick={handleApplyHat}>적용하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvatarPage;

