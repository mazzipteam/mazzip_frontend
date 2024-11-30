import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './homePage/homePage';
import LoginPage from './loginPage/loginPage';
import Notification from './Notification/Notification';
import MyPage from './MyPage/MyPage';
import AvatarPage from './AvatarPage/AvatarPage';
import MyReservationPage from './MyReservationPage/MyReservationPage';
import ReviewPage from './ReviewPage/ReviewPage';
import WishListPage from './WishListPage/WishListPage';
import SignupPage from './SignupPage/SignupPage';
import NavBar from './NavBar/NavBar';
import MemoPage from './MemoPage/MemoPage';

import SearchResultPage from './SearchResultPage/SearchResultPage';
import RestaurantDetailPage from './RestaurantDetailPage/RestaurantDetailPage';
import OwnerInfoPage from './OwnerInfoPage/OwnerInfoPage'; // OwnerInfoPage 컴포넌트 추가
import FindIDPWPage from './FindIDPWPage/FindIDPWPage';
import './App.css';


function App() {
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태 추가

  return (
    <Router>
      <div className="App">
        {/* NavBar에 profileImage 전달 */}
        <NavBar profileImage={profileImage} />


        <Routes>
          {/* 홈 페이지 */}
          <Route path="/" element={<HomePage />} />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          {/* 회원가입 페이지 */}
          <Route path="/login/signup" element={<SignupPage />} />
          {/* 아이디/비밀번호 찾기 페이지*/}
          <Route path="/login/findIDPW" element={<FindIDPWPage />} />
          {/* 알림 페이지 */}
          <Route path="/notifications" element={<Notification />} />
          {/* 마이 페이지 - setProfileImage 전달 */}
          <Route path="/mypage" element={<MyPage setProfileImage={setProfileImage} />} />
          {/* 아바타 페이지 */}
          <Route path="/avatar" element={<AvatarPage />} />
          {/* 예약 페이지 */}
          <Route path="/reservation" element={<MyReservationPage />} />
          {/* 리뷰 페이지 */}
          <Route path="/review" element={<ReviewPage />} />
          {/* 찜 목록 페이지 */}
          <Route path="/wishlist" element={<WishListPage />} />
          {/* 검색 결과 페이지 */}
          <Route path="/search" element={<SearchResultPage />} />
          {/* 상세 페이지 */}
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          {/* 점주 정보 페이지 */}
          <Route path="/owner-info" element={<OwnerInfoPage />} />
          {/* 메모 페이지 */}
          <Route path="/memo" element={<MemoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




// import React from 'react';
// import OwnerInfoPage from './OwnerInfoPage/OwnerInfoPage';
// import RestaurantDetailPage from './RestaurantDetailPage/RestaurantDetailPage';

// function App() {
  
//   return <RestaurantDetailPage />;
// }

// export default App;


// import React from 'react';
// import MemoPage from './MemoPage/MemoPage';
// function App() {
//   return (
//     <div className="App">
//       <MemoPage />
//     </div>
//   );
// }

// export default App;