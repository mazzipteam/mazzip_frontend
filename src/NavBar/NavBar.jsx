import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar() {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

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
                <button className={styles.loginSignup} onClick={() => navigate('/login')}>로그인/회원가입</button>
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
