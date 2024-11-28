//원래 dev코드
// import React from 'react';
// import NavBar from '../NavBar/NavBar'; // NavBar 컴포넌트 임포트
// import './homePage.css';

// function HomePage() {
//     return (
//         <div className="homepage">
//             <NavBar /> {/* 상단바 컴포넌트 추가 */}
//             <main className="search-section">
//                 <h2 className="main-title">MaZZip!</h2>
//                 <div className="search-bar">
//                     <input id="search-input" type="text" placeholder="검색어를 입력하세요" />
//                     <button onClick={() => alert("검색 실행")}>🔍</button>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default HomePage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router를 이용하기 위해 import
import NavBar from '../NavBar/NavBar'; // NavBar 컴포넌트 임포트
import './homePage.css';
import React from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './homePage.module.css';


function HomePage() {
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 관리
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`); // 검색어를 쿼리 파라미터로 전달
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (

//         <div className="homepage">
//             <NavBar /> {/* 상단바 컴포넌트 추가 */}
//             <main className="search-section">
//                 <h2 className="main-title">MaZZip!</h2>
//                 <div className="search-bar">
//                     <input
//                         id="search-input"
//                         type="text"
//                         placeholder="검색어를 입력하세요"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)} // 입력값 상태 업데이트
//                         onKeyPress={handleKeyPress} // Enter 키 처리
//                     />
//                     <button onClick={handleSearch}>🔍</button> {/* 버튼 클릭 시 검색 */}


        <div className={styles.homepage}>
            <NavBar />
            <main className={styles.searchSection}>
                <h2 className={styles.mainTitle}>MaZZip!</h2>
                <div className={styles.searchBar}>
                    <input id="search-input" type="text" placeholder="검색어를 입력하세요" />
                    <button onClick={() => alert("검색 실행")}>🔍</button>

                </div>
            </main>
        </div>
    );
}

export default HomePage;
