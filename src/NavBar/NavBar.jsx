import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar({ profileImage }) { // profileImage prop 추가
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button className="menu-icon" onClick={toggleMenu}>☰</button>
            </div>
            <h1 className="logo" onClick={() => navigate('/')}>MaZZip!</h1>
            <div className="navbar-right">
                <button className="icon" onClick={() => navigate('/notifications')}>🔔</button>
                <div className="user-icon" onClick={() => navigate('/mypage')}>
                    {profileImage ? (
                        <img src={profileImage} alt="프로필 사진" className="profile-icon" />
                    ) : (
                        <div className="default-icon">⭕</div>
                    )}
                </div>
                <button className="login-signup" onClick={() => navigate('/login')}>로그인/회원가입</button>
            </div>

            {/* 메뉴 팝업 */}
            {showMenu && (
                <div className="menu-popup">
                    <ul>
                        <li onClick={() => navigate('/review')}>리뷰 창 이동 (이미지 삽입)</li>
                        <li onClick={() => navigate('/wishlist')}>찜 목록 이동 (이미지 삽입)</li>
                        <li onClick={() => navigate('/reservation')}>예약 창 이동 (이미지 삽입)</li>
                        <li onClick={() => navigate('/avatar')}>아바타 이동 (이미지 삽입)</li>
                    </ul>
                </div>
            )}
        </header>
    );
}

export default NavBar;