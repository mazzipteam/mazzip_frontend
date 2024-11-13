import React from 'react';
import NavBar from '../NavBar/NavBar'; // NavBar 컴포넌트 임포트
import './loginPage.css';

function SignupPage() {
    return(
        <div className="SignupPage">
            <NavBar />{/* 상단바 컴포넌트 추가*/}
        </div>
    );
}

export default SignupPage;