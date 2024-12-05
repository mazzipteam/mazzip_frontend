import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        checkLoginStatus();
    }, [location]); // location이 변경될 때마다 로그인 상태 확인

    const checkLoginStatus = () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUserInfo(userId);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            setUserName('');
        }
    };

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/user/${userId}`);
            const data = await response.json();
            if (data.code === 200) {
                setUserName(data.data.nickName); // API 응답에서 사용자 이름 가져오기
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId'); // localStorage에서 userId 제거
        setIsLoggedIn(false);
        setUserName('');
        navigate('/login'); // 로그인 페이지로 이동
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <header className={styles.navbar}>
            <div className={styles.navbarLeft}>
                <button className={styles.menuIcon} onClick={toggleMenu}>☰</button>
            </div>
            <h1 className={styles.logo} onClick={() => navigate('/')}>MaZZip!</h1>
            <div className={styles.navbarRight}>
                <button className={styles.icon} onClick={() => navigate('/notifications')}>🔔</button>
                {isLoggedIn ? (
                    <>
                        <span className={styles.userName}>{userName}님</span>
                        <button className={styles.logoutButton} onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <button 
                        className={styles.loginSignup} 
                        onClick={() => navigate('/login')}
                    >
                        로그인/회원가입
                    </button>
                )}
            </div>

            {showMenu && (
                <div className={styles.menuPopup}>
                    <ul>
                        <li onClick={() => navigate('/review')}>리뷰 창 이동</li>
                        <li onClick={() => navigate('/wishlist')}>찜 목록 이동</li>
                        <li onClick={() => navigate('/reservation/list')}>예약 창 이동</li>
                        <li onClick={() => navigate('/avatar')}>아바타 이동</li>
                        <li onClick={() => navigate('/memo')}>메모 이동</li>
                        <li onClick={() => navigate('/owner-info')}>점주관리 창 이동</li>
                    </ul>
                </div>
            )}
        </header>
    );
}

export default NavBar;
