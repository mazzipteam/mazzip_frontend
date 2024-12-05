import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './SignupPage.module.css';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '', // 사용자 닉네임
    phone: '', // 연락처
    address: '', // 사용자 주소 (점주: 가게 주소)
    detailAddress: '', // 상세주소
    storeName: '', // 가게 이름
    businessAddress: '', // 가게 주소
    businessName: '', // 상호명
    proprietor: '', // 사업체 소유자 이름
    category: '', // 한식/중식/일식/양식
    takeOut: '', // 테이크아웃 가능 여부 (yes/no)
    storePhone: '', // 가게 전화번호
    userId: '', // 사용자 ID (백엔드에서 처리 가능)
    role: 'USER', // 기본값은 USER, 점주는 OWNER로 변경
  });


  // 파일 상태 추가
  const [files, setFiles] = useState({
    storeFrontImage: null,
    interiorImage: null,
    menuImage: null,
  });

  //파일 업로드 입력이 변경될 때 호출됩니다. 업로드된 파일은 files 상태에 저장됩니다.
  const handleFileChange = (e) => {
    const { id, files: inputFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [id]: inputFiles[0], // 단일 파일만 업로드
    }));
  };


  // const handleFileChange = (e) => {
  //   const { id, files: inputFiles } = e.target;
  //   const file = inputFiles[0];
    
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = reader.result;
  //       // Base64 문자열에서 헤더 부분 제거
  //       const base64Data = base64String.split(',')[1];
  //       setFiles((prevFiles) => ({
  //         ...prevFiles,
  //         [id]: base64Data, // Base64 데이터로 상태 업데이트
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  



//점주 회원가입을 처리, 관리자 승인이 필요한 데이터를 전송
//폼 데이터와 파일을 FormData 객체로 서버에 전송
//서버 응답에 따라 성공/실패 메시지를 표시
const handleApprovalSubmit = async () => {
  try {
    const formDataToSend = new FormData();

    // 점주 회원가입 데이터를 객체로 만듦
    const signUpDTO = {
      detailAddress: formData.detailAddress || 'empty',
      userId: 5, // 관리자 id로 하드코딩
      takeOut: formData.takeOut || 'Y',
      restaurantTelNum: formData.storePhone,
      telNum: formData.phone,
      businessName: formData.businessName,
      name: formData.storeName,
      nickName: formData.username,
      address: formData.businessAddress,
      role: 'OWNER',
      restaurantAddress: formData.businessAddress,
      password: formData.password,
      email: formData.email,
      propritor: formData.proprietor,
      category: formData.category,
    };

    // FormData에 JSON 형태로 DTO 추가
    formDataToSend.append('signUpDTO', JSON.stringify(signUpDTO));

    // 파일 추가 (있는 경우에만 추가)
    if (files.storeFrontImage) {
      formDataToSend.append('multipartFileForeground', files.storeFrontImage);
    }
    else {
      // 빈 파일 생성
      const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
      formDataToSend.append('multipartFileForeground', emptyBlob, 'empty.txt');
    }

    if (files.interiorImage) {
      formDataToSend.append('multipartFileInterior', files.interiorImage);
    }
    else {
      // 빈 파일 생성
      const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
      formDataToSend.append('multipartFileInterior', emptyBlob, 'empty.txt');
    }

    if (files.menuImage) {
      formDataToSend.append('multipartFileMenu', files.menuImage);
    }
    else {
      // 빈 파일 생성
      const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
      formDataToSend.append('multipartFileMenu', emptyBlob, 'empty.txt');
    }

    // 디버깅용 FormData 내용 출력
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    // API 요청
    const response = await fetch('http://43.201.45.105:8080/api/v1/signup', {
      method: 'POST',
      body: formDataToSend,
    });

    // 응답 처리
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '관리자 승인 요청에 실패했습니다.');
    }

    const data = await response.json();
    alert(data.message || '관리자 승인 요청이 성공적으로 완료되었습니다.');
    navigate('/login');
  } catch (error) {
    console.error('Error during approval request:', error);
    alert(error.message);
  }
};


  //일반 사용자와 점주 탭을 전환합니다. isUser 값을 변경하여 폼 내용이 달라지도록 합니다.
  const handleTabClick = (userType) => {
    setIsUser(userType === 'user');
  };

  //폼 입력 필드가 변경될 때 호출됩니다. 입력된 값은 formData 상태에 업데이트됩니다.
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  //일반 사용자 회원가입을 처리, 폼 데이터를 JSON 형식으로 서버로 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert('패스워드가 일치하지 않습니다.');
      return;
    }
  
    const payload = isUser
      ? {
          email: formData.email,
          password: formData.password,
          nickName: formData.username,
          telNum: formData.phone,
          address: formData.address,
          detailAddress: formData.detailAddress,
          role: 'USER',
        }
      : {
          email: formData.email,
          password: formData.password,
          nickName: formData.username,
          telNum: formData.storePhone, // 가게 전화번호
          address: formData.businessAddress, // 가게 주소
          detailAddress: formData.detailAddress,
          role: 'OWNER',
          name: formData.storeName, // 가게 이름
          businessName: formData.businessName, // 상호명
          proprietor: formData.proprietor, // 사업체 소유자
          category: formData.category, // 음식 카테고리
          takeOut: formData.takeOut, // 테이크아웃 가능 여부
          userId: formData.userId, // 사용자 ID (백엔드에서 처리 가능)
        };
  
    try {
      //일반 사용자 회원가입 API, http://localhost:8080/api/v1/user로 POST 요청을 전송. JSON 형식의 데이터를 전송
      const response = await fetch('http://43.201.45.105:8080/api/v1/user/allInOne', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }
  
      const data = await response.json();
      alert(data.message || '회원가입이 성공적으로 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      alert(error.message);
    }
  };
  

  return (
    <div className={styles.signupPage}>
      <NavBar />
      <div className={styles.signupContainer}>
        <h2>회원가입</h2>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${isUser ? styles.active : ''}`}
            onClick={() => handleTabClick('user')}
          >
            일반 사용자 회원가입
          </button>
          <button
            className={`${styles.tabButton} ${!isUser ? styles.active : ''}`}
            onClick={() => handleTabClick('owner')}
          >
            점주 회원가입
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.formGroup} ${styles.email}`}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              placeholder="이메일 입력"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <button type="button" className={styles.duplicateCheck}>
              중복
            </button>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">패스워드</label>
            <input
              type="password"
              id="password"
              placeholder="패스워드 입력"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">패스워드 확인</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="패스워드 확인"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">이름</label>
            <input
              type="text"
              id="username"
              placeholder="이름 입력"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">연락처</label>
            <input
              type="tel"
              id="phone"
              placeholder="연락처 입력"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {isUser ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="address">주소</label>
                <input
                  type="text"
                  id="address"
                  placeholder="주소 입력"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="detailAddress">상세주소</label>
                <input
                  type="text"
                  id="detailAddress"
                  placeholder="상세주소 입력"
                  required
                  value={formData.detailAddress}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className={styles.signupButtonSignupPage}>
                일반 사용자 회원가입
              </button>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
        <label htmlFor="storeName">가게 이름</label>
        <input
          type="text"
          id="storeName"
          placeholder="가게 이름 입력"
          required
          value={formData.storeName}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="businessAddress">가게 주소</label>
        <input
          type="text"
          id="businessAddress"
          placeholder="가게 주소 입력"
          required
          value={formData.businessAddress}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="businessName">상호명</label>
        <input
          type="text"
          id="businessName"
          placeholder="상호명 입력"
          required
          value={formData.businessName}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="proprietor">사업체 소유자</label>
        <input
          type="text"
          id="proprietor"
          placeholder="사업체 소유자 입력"
          required
          value={formData.proprietor}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="category">음식 카테고리</label>
        <input
          type="text"
          id="category"
          placeholder="예: 한식, 중식"
          required
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="storePhone">가게 전화번호</label>
        <input
          type="tel"
          id="storePhone"
          placeholder="가게 전화번호 입력"
          required
          value={formData.storePhone}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="takeOut">테이크아웃 가능 여부</label>
        <select
          id="takeOut"
          required
          value={formData.takeOut}
          onChange={handleChange}
        >
          <option value="">선택</option>
          <option value="yes">가능</option>
          <option value="no">불가능</option>
        </select>
      </div>
      <div className={styles.formGroup}>
  <label htmlFor="storeFrontImage">가게 전경 사진</label>
  <input
    type="file"
    id="storeFrontImage"
    accept="image/*"
    onChange={handleFileChange}
  />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="interiorImage">인테리어 사진</label>
      <input
        type="file"
        id="interiorImage"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="menuImage">메뉴판 사진</label>
      <input
        type="file"
        id="menuImage"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>

      <button
        type="button"
        className={styles.waitApprovalButton}
        onClick={handleApprovalSubmit}
      >
        관리자 승인 대기
      </button>

      </>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;