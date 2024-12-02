import React from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './loginPage.module.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.loginPage}>
            <NavBar />
            <div className={styles.loginContainer}>
                <h2 className={styles.loginTitle}>LOGIN</h2>
                <form className={styles.loginForm}>
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" placeholder="이메일" required />
                    <label htmlFor="password">패스워드</label>
                    <input type="password" id="password" placeholder="패스워드" required />
                    <button type="submit" className={styles.loginButton}>로그인하기</button>
                    <button type="button" className={styles.signupButton} onClick={() => navigate("./signup")}>회원가입</button>
                </form>
                <div className={styles.findLinks}>
                    <button type="button" className={styles.findIDPW} onClick={() => navigate("./findIDPW")}>아이디/비밀번호 찾기</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
