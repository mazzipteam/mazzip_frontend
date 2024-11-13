import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar'; // NavBar 컴포넌트 임포트
import './FindIDPWPage.css';

function FindIDPWPage() {
  const [isFindID, setIsFindID] = useState(true); // 아이디 찾기와 비밀번호 찾기 구분

  const handleTabClick = (tab) => {
    setIsFindID(tab === 'findID');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 아이디 또는 비밀번호 찾기 처리 로직 추가
  };

  return (
    <div className="FindIDPWPage">
      <NavBar />
      <div className="find-container">
        <h2>아이디 찾기</h2>
        <div className="tab-buttons">
          <button
            className={`tab-button ${isFindID ? 'active' : ''}`}
            onClick={() => handleTabClick('findID')}
          >
            아이디 찾기
          </button>
          <button
            className={`tab-button ${!isFindID ? 'active' : ''}`}
            onClick={() => handleTabClick('findPW')}
          >
            비밀번호 찾기
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input type="text" id="name" placeholder="이름 입력" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input type="tel" id="phone" placeholder="연락처 입력" required />
          </div>
          {!isFindID && (
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input type="email" id="email" placeholder="이메일 입력" required />
            </div>
          )}
          <button type="submit" className="find-button">
            {isFindID ? '아이디 찾기' : '비밀번호 찾기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FindIDPWPage;
