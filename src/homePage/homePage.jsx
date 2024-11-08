// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
// import './homePage.css';

// function HomePage() {
//     const [showMenu, setShowMenu] = useState(false);
//     const navigate = useNavigate(); // 네비게이트 함수 생성

//     const handleSearch = () => {
//         const query = document.getElementById("search-input").value;
//         if (query) {
//             // 검색 결과 페이지로 이동
//             navigate(`/search?query=${query}`);
//         }
//     };

//     const toggleMenu = () => {
//         setShowMenu(!showMenu);
//     };

//     return (
//         <div className="homepage">
//             <header className="navbar">
//                 <div className="navbar-left">
//                     <button className="menu-icon" onClick={toggleMenu}>
//                         ☰
//                     </button>
//                 </div>
//                 <h1 className="logo">MaZZip!</h1>
//                 <div className="navbar-right">
//                     <button className="icon" onClick={() => navigate('/notifications')}>
//                         🔔
//                     </button>
//                     <button className="user-icon" onClick={() => navigate('/mypage')}>
//                         ⭕
//                     </button>
//                     <button className="login-signup" onClick={() => navigate('/login')}>
//                         로그인/회원가입
//                     </button>
//                 </div>
//             </header>

//             {showMenu && (
//                 <div className="menu-popup">
//                     <ul>
//                         <li>리뷰 창 이동 (이미지 삽입)</li>
//                         <li>찜 목록 이동 (이미지 삽입)</li>
//                         <li>예약 창 이동 (이미지 삽입)</li>
//                         <li>아바타 이동 (이미지 삽입)</li>
//                     </ul>
//                 </div>
//             )}

//             <main className="search-section">
//                 <h2 className="main-title">MaZZip!</h2>
//                 <div className="search-bar">
//                     <input id="search-input" type="text" placeholder="검색어를 입력하세요" />
//                     <button onClick={handleSearch}>🔍</button>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default HomePage;


import React from 'react';
import NavBar from '../NavBar/NavBar'; // NavBar 컴포넌트 임포트
import './homePage.css';

function HomePage() {
    return (
        <div className="homepage">
            <NavBar /> {/* 상단바 컴포넌트 추가 */}
            <main className="search-section">
                <h2 className="main-title">MaZZip!</h2>
                <div className="search-bar">
                    <input id="search-input" type="text" placeholder="검색어를 입력하세요" />
                    <button onClick={() => alert("검색 실행")}>🔍</button>
                </div>
            </main>
        </div>
    );
}

export default HomePage;
