// 1. 예약 시 잠금 해제 기능 반영안된 코드. 모자 위치 테스트해볼 때 쓰기

// import React, { useState, useEffect } from 'react';
// import styles from './AvatarPage.module.css';

// function AvatarPage() {
//     const [hatImages, setHatImages] = useState([]);
//     const [selectedHat, setSelectedHat] = useState(null); // 선택된 모자

//     useEffect(() => {
//         // 주석: API 호출 부분
//         /*
//         fetch('/api/hat-images')
//             .then((response) => response.json())
//             .then((data) => {
//                 setHatImages(data); // 서버에서 받은 데이터 설정
//             })
//             .catch((error) => {
//                 console.error('모자 이미지 데이터를 가져오는 중 오류 발생:', error);
//             });
//         */

//         // 임시 데이터셋: hat1.png ~ hat12.png
//         const temporaryDataset = Array(12)
//             .fill()
//             .map((_, index) => `/hat${index + 1}.png`);
//         setHatImages(temporaryDataset);
//     }, []);

//     const handleHatClick = (hat) => {
//         setSelectedHat(hat); // 선택된 모자 업데이트
//     };

//     const handleClearHat = () => {
//         setSelectedHat(null); // 모자 제거
//     };

//     return (
//         <div className={styles.avatarPage}>
//             <h2 className={styles.avatarTitle}>아바타 키우기</h2>
//             <div className={styles.avatarContainer}>
//                 {/* 왼쪽 모자 선택 */}
//                 <div className={styles.avatarItems}>
//                     {hatImages.map((image, index) => (
//                         <div key={index} className={styles.avatarItem}>
//                             <img
//                                 src={image}
//                                 alt={`Hat ${index + 1}`}
//                                 onClick={() => handleHatClick(image)} // 모자 클릭 이벤트
//                                 className={styles.hatImage}
//                             />
//                         </div>
//                     ))}
//                 </div>
//                 {/* 오른쪽 아바타 */}
//                 <div className={styles.avatarDisplay}>
//                     <div className={styles.avatarContainer}>
//                         {/* 강아지 아바타 */}
//                         <img
//                             src="/아바타샘플.jpg"
//                             alt="Avatar"
//                             className={styles.avatarImage}
//                         />
//                         {/* 선택된 모자 */}
//                         {selectedHat && (
//                             <img
//                                 src={selectedHat}
//                                 alt="Selected Hat"
//                                 className={styles.selectedHat}
//                             />
//                         )}
//                     </div>
//                     {/* 동작 버튼 */}
//                     <div className={styles.avatarActions}>
//                         <button className={styles.actionButton} onClick={handleClearHat}>
//                             모두벗기
//                         </button>
//                         <button className={styles.actionButton}>적용하기</button>
//                         <button className={styles.actionButton}>상호작용</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AvatarPage;





// 2. 예약 시 잠금 해제 기능 반영된 코드. // API연결1. API 호출로 예약 개수 가져오기 이부분 해야함. 

import React, { useState, useEffect } from 'react';
import styles from './AvatarPage.module.css';

function AvatarPage() {
    const [hatImages, setHatImages] = useState([]); // 모자 이미지 리스트
    const [selectedHat, setSelectedHat] = useState(null); // 선택된 모자
    const [reservationCount, setReservationCount] = useState(0); // 예약 개수 상태 추가
    const userId = localStorage.getItem('userId'); // 로컬스토리지에서 사용자 ID 가져오기

    //유저 아이디로 예약횟수 가져오기. 가져온 예약횟수는 reservationCount에 저장됨.
    useEffect(() => {
        //모자 이미지 리스트 생성 (임시 데이터셋)
        // const temporaryDataset = Array(12)
        //     .fill()
        //     .map((_, index) => `/hat${index + 1}.png`);
        // setHatImages(temporaryDataset);
    
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
        console.log(hatImages);
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
                            src={selectedHat}
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

