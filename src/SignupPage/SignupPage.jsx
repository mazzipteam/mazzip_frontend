import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import './SignupPage.css';

function SignupPage() {
  const [isUser, setIsUser] = useState(true);

  const handleTabClick = (userType) => {
    setIsUser(userType === 'user');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="SignupPage">
      <NavBar />
      <div className="signup-container">
        <h2>회원가입</h2>
        <div className="tab-buttons">
          <button
            className={`tab-button ${isUser ? 'active' : ''}`}
            onClick={() => handleTabClick('user')}
          >
            일반 사용자 회원가입
          </button>
          <button
            className={`tab-button ${!isUser ? 'active' : ''}`}
            onClick={() => handleTabClick('owner')}
          >
            점주 회원가입
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group email">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" placeholder="이메일 입력" required />
            <button className="duplicate-check">중복</button>
          </div>
          <div className="form-group">
            <label htmlFor="password">패스워드</label>
            <input type="password" id="password" placeholder="패스워드 입력" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">패스워드 확인</label>
            <input type="password" id="confirmPassword" placeholder="패스워드 확인" required />
          </div>
          <div className="form-group">
            <label htmlFor="username">이름</label>
            <input type="text" id="username" placeholder="이름 입력" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input type="tel" id="phone" placeholder="연락처 입력" required />
          </div>
          {isUser ? (
            <>
              <div className="form-group">
                <label htmlFor="address">주소</label>
                <input type="text" id="address" placeholder="주소 입력" required />
              </div>
              <div className="form-group">
                <label htmlFor="detailAddress">상세주소</label>
                <input type="text" id="detailAddress" placeholder="상세주소 입력" required />
              </div>
              <button type="submit" className="signup-button-signupPage">일반 사용자 회원가입</button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="storeName">매장명</label>
                <input type="text" id="storeName" placeholder="매장명 입력" required />
              </div>
              <div className="form-group">
                <label htmlFor="businessAddress">매장주소</label>
                <input type="text" id="businessAddress" placeholder="매장주소 입력" required />
              </div>
              <div className="form-group">
                <label htmlFor="detailAddress">상세주소</label>
                <input type="text" id="detailAddress" placeholder="상세주소 입력" required />
              </div>
              <button type="submit" className="signup-button-signupPage">점주 회원가입 및 관리자 승인 대기</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
