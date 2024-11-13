// import React from 'react';
// import './loginPage.css';

// function LoginPage() {
//     return (
//         <div className="login-page">
//             <header className="navbar">
//                 <div className="navbar-left">
//                     <button className="menu-icon">☰</button>
//                 </div>
//                 <h1 className="logo">MaZZip!</h1>
//                 <div className="navbar-right">
//                     <button className="icon">🔔</button>
//                     <button className="user-icon">⭕</button>
//                 </div>
//             </header>
            
//             <div className="login-container">
//                 <h2 className="login-title">LOGIN</h2>
//                 <form className="login-form">
//                     <label htmlFor="email">이메일</label>
//                     <input type="email" id="email" placeholder="이메일" />
                    
//                     <label htmlFor="password">패스워드</label>
//                     <input type="password" id="password" placeholder="패스워드" />
                    
//                     <button type="submit" className="login-button">로그인하기</button>
//                     <button type="button" className="signup-button">회원가입</button>
//                 </form>
                
//                 <div className="find-links">
//                     <a href="/find-id">아이디 찾기</a>
//                     <a href="/find-password">비밀번호 찾기</a>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LoginPage;


import React from 'react';
import NavBar from '../NavBar/NavBar'; // NavBar 컴포넌트 임포트
import './loginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <NavBar /> {/* 상단바 컴포넌트 추가 */}
            <div className="login-container">
                <h2 className="login-title">LOGIN</h2>
                <form className="login-form">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" placeholder="이메일" required />
                    <label htmlFor="password">패스워드</label>
                    <input type="password" id="password" placeholder="패스워드" required />
                    <button type="submit" className="login-button">로그인하기</button>
                    <button type="button" className="signup-button" onClick={() => navigate("./signup")}>회원가입</button>
                </form>
                <div className="find-links">
                    {/* <a href="/find-id">아이디 찾기</a>
                    <a href="/find-password">비밀번호 찾기</a> */}
                    <button type="button" className="findIDPW" onClick={() => navigate("./findIDPW")}>아이디/비밀번호 찾기</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
