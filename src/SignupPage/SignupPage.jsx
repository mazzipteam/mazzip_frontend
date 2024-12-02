import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './SignupPage.module.css';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone: '',
    address: '',
    detailAddress: '',
    storeName: '',
    businessAddress: '',
  });

  const handleTabClick = (userType) => {
    setIsUser(userType === 'user');
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('패스워드가 일치하지 않습니다.');
      return;
    }

    const payload = isUser
      ? {
          email: formData.email,
          password: formData.password,
          nickName: formData.username,
          telNum: formData.phone,
          address: formData.address,
          detailAddress: formData.detailAddress,
          role: 'USER',
        }
      : {
          email: formData.email,
          password: formData.password,
          nickName: formData.username,
          telNum: formData.phone,
          address: formData.businessAddress,
          detailAddress: formData.detailAddress,
          role: 'OWNER',
        };

    try {
      const response = await fetch('http://localhost:8080/api/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      const data = await response.json();
      alert(data.message || '회원가입이 성공적으로 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      alert(error.message);
    }
  };

  return (
    <div className={styles.signupPage}>
      <NavBar />
      <div className={styles.signupContainer}>
        <h2>회원가입</h2>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${isUser ? styles.active : ''}`}
            onClick={() => handleTabClick('user')}
          >
            일반 사용자 회원가입
          </button>
          <button
            className={`${styles.tabButton} ${!isUser ? styles.active : ''}`}
            onClick={() => handleTabClick('owner')}
          >
            점주 회원가입
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.formGroup} ${styles.email}`}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              placeholder="이메일 입력"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <button type="button" className={styles.duplicateCheck}>
              중복
            </button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">패스워드</label>
            <input
              type="password"
              id="password"
              placeholder="패스워드 입력"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">패스워드 확인</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="패스워드 확인"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">이름</label>
            <input
              type="text"
              id="username"
              placeholder="이름 입력"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">연락처</label>
            <input
              type="tel"
              id="phone"
              placeholder="연락처 입력"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {isUser ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="address">주소</label>
                <input
                  type="text"
                  id="address"
                  placeholder="주소 입력"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="detailAddress">상세주소</label>
                <input
                  type="text"
                  id="detailAddress"
                  placeholder="상세주소 입력"
                  required
                  value={formData.detailAddress}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className={styles.signupButtonSignupPage}>
                일반 사용자 회원가입
              </button>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="storeName">매장명</label>
                <input
                  type="text"
                  id="storeName"
                  placeholder="매장명 입력"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="businessAddress">매장주소</label>
                <input
                  type="text"
                  id="businessAddress"
                  placeholder="매장주소 입력"
                  required
                  value={formData.businessAddress}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="detailAddress">상세주소</label>
                <input
                  type="text"
                  id="detailAddress"
                  placeholder="상세주소 입력"
                  required
                  value={formData.detailAddress}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className={styles.signupButtonSignupPage}>
                점주 회원가입 및 관리자 승인 대기
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
