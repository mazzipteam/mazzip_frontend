import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './FindIDPWPage.module.css';

function FindIDPWPage() {
  const [isFindID, setIsFindID] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabClick = (tab) => {
    setIsFindID(tab === 'findID');
    setResult('');
    setErrorMessage('');
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
    setErrorMessage('');
    setResult('');

    try {
      // 이름과 전화번호를 인코딩하여 URL에 추가
      const encodedName = encodeURIComponent(formData.name);
      const encodedPhone = encodeURIComponent(formData.phone);
      const encodedEmail = formData.email ? encodeURIComponent(formData.email) : '';
  
      const url = isFindID
        ? `http://localhost:8080/api/v1/user/findId/${encodedName}/${encodedPhone}`
        : `http://localhost:8080/api/v1/user/findPassword/${encodedName}/${encodedPhone}/${encodedEmail}`;
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '요청에 실패했습니다.');
      }
  
      const data = await response.json();
      setResult(
        isFindID
          ? `찾으신 아이디는: ${data.data}`
          : `임시 비밀번호는: ${data.data}`
      );
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || '요청 처리 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className={styles.findIDPWPage}>
      <NavBar />
      <div className={styles.findContainer}>
        <h2>{isFindID ? '아이디 찾기' : '비밀번호 찾기'}</h2>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${isFindID ? styles.tabButtonActive : ''}`}
            onClick={() => handleTabClick('findID')}
          >
            아이디 찾기
          </button>
          <button
            className={`${styles.tabButton} ${!isFindID ? styles.tabButtonActive : ''}`}
            onClick={() => handleTabClick('findPW')}
          >
            비밀번호 찾기
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              placeholder="이름 입력"
              required
              value={formData.name}
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
          {!isFindID && (
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                placeholder="이메일 입력"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          )}
          <button type="submit" className={styles.findButton}>
            {isFindID ? '아이디 찾기' : '비밀번호 찾기'}
          </button>
        </form>
        {result && <p className={styles.resultMessage}>{result}</p>}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default FindIDPWPage;
