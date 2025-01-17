import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './loginPage.module.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const BASE_URL = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // LoginDTO의 필드에 맞춰 전송
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '로그인에 실패했습니다.');
            }

            const data = await response.json();
            console.log('Login response:', data);
            if (response.ok) {
                localStorage.setItem('userId', data.data.userId);
                console.log('Stored userId:', localStorage.getItem('userId'));
                alert('로그인 성공!');
                navigate('/');
            } else {
                    throw new Error(data.message || '로그인에 실패했습니다.');
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
                };

    return (
        <div className={styles.loginPage}>
            <NavBar />
            <div className={styles.loginContainer}>
                <h2 className={styles.loginTitle}>LOGIN</h2>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="이메일"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="password">패스워드</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="패스워드"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                    <button type="submit" className={styles.loginButton}>
                        로그인하기
                    </button>
                    <button
                        type="button"
                        className={styles.signupButton}
                        onClick={() => navigate('./signup')}
                    >
                        회원가입
                    </button>
                </form>
                <div className={styles.findLinks}>
                    <button
                        type="button"
                        className={styles.findIDPW}
                        onClick={() => navigate('./findIDPW')}
                    >
                        아이디/비밀번호 찾기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
