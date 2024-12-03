import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router를 이용하기 위해 import
import NavBar from '../NavBar/NavBar'; // NavBar 컴포넌트 임포트
import styles from './homePage.module.css';

function HomePage() {
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 관리
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
    //const userId = localStorage.getItem('userId'); //나중에 시간남아서 상단바에 유저이름 띄울때 사용
    
    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`); // 검색어를 쿼리 파라미터로 전달
        } else {
            alert("검색어를 입력해주세요."); // 검색어가 비어있는 경우 경고
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={styles.homepage}>
            <NavBar />
            <main className={styles.searchSection}>
                <h2 className={styles.mainTitle}>MaZZip!</h2>
                <div className={styles.searchBar}>
                    <input
                        id="search-input"
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchQuery} // 상태 값 바인딩
                        onChange={(e) => setSearchQuery(e.target.value)} // 입력값 업데이트
                        onKeyPress={handleKeyPress} // Enter 키 처리
                    />
                    <button onClick={handleSearch}>🔍</button> {/* 버튼 클릭 시 검색 */}
                </div>
            </main>
        </div>
    );
}

export default HomePage;
