import React, { useState, useRef } from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './MyPage.module.css';

function MyPage({ setProfileImage }) {
    const [localProfileImage, setLocalProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLocalProfileImage(imageUrl);
            setProfileImage(imageUrl);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={styles.mypage}>
            <NavBar profileImage={localProfileImage} />
            <div className={styles.mypageContent}>
                <h2 className={styles.mypageTitle}>MY page</h2>
                
                <div className={styles.profileSection}>
                    <h3 className={styles.sectionTitle}>프로필 미리보기</h3>
                    <div className={styles.profileOverview}>
                        <div className={styles.profileImage}>
                            {localProfileImage ? (
                                <img src={localProfileImage} alt="프로필 사진" className={styles.profilePhotoPreview} />
                            ) : (
                                '프로필'
                            )}
                        </div>
                        <div className={styles.profileDescription}>프로필 설명</div>
                    </div>
                    <div className={styles.profileDetails}>
                        <div className={styles.profilePhotoLabel}>프로필 사진</div>
                        <div className={styles.profilePhoto}>
                            {localProfileImage ? (
                                <img src={localProfileImage} alt="프로필 사진 미리보기" className={styles.profilePhotoPreview} />
                            ) : (
                                '프로필 사진이 없습니다'
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className={styles.fileInput}
                        />
                        <button className={styles.imageChangeBtn} onClick={handleButtonClick}>
                            이미지 추가/변경
                        </button>
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>개인정보 수정</h3>
                    <div className={styles.infoItem}>
                        <label>이메일</label>
                        <div className={styles.infoValue}>고정</div>
                    </div>
                    <div className={styles.infoItem}>
                        <label>이름</label>
                        <div className={styles.infoValue}></div>
                    </div>
                    <div className={styles.infoItem}>
                        <label>연락처</label>
                        <div className={styles.infoValue}></div>
                    </div>
                    <div className={styles.infoItem}>
                        <label>주소</label>
                        <div className={styles.infoValue}></div>
                    </div>
                    <button className={styles.changePasswordBtn}>비밀번호 변경</button>
                    <button className={styles.deleteAccountBtn}>회원 탈퇴</button>
                </div>
            </div>
        </div>
    );
}

export default MyPage;
