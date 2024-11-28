import React, { useState } from 'react';
import './OwnerInfoPage.css';

const OwnerInfoPage = () => {
  const [activeTab, setActiveTab] = useState('점주정보');

  const renderContent = () => {
    switch (activeTab) {
      case '점주정보':
        return (
          <div className="tab-content">
            <form className="owner-info-form">
              <div className="form-row">
                <label>이메일</label>
                <input type="email" placeholder="user" />
                <span>이메일은 추가 인증이 필요합니다.</span>
              </div>
              <div className="form-row">
                <label>비밀번호</label>
                <input type="password" placeholder="user1234" />
                <span>새로운 비밀번호를 지정합니다.</span>
              </div>
              <div className="form-row">
                <label>별명</label>
                <input type="text" placeholder="마찜마켓" />
                <span>리뷰에 작성될 사용자의 명칭입니다.</span>
              </div>
              <div className="form-row">
                <label>전화번호</label>
                <input type="tel" placeholder="010-0000-0000" />
                <span>리뷰에 작성될 사용자의 명칭입니다.</span>
              </div>
              <div className="form-row">
                <label>주소</label>
                <input type="text" placeholder="서울특별시 삼성교로17" />
                <span>사용자가 거주중인 주소입니다.</span>
              </div>
              <div className="form-row">
                <label>상세 주소</label>
                <input type="text" placeholder="0000동 0000호" />
                <span>사용자의 추가적인 주소 기입사항입니다.</span>
              </div>
            </form>
          </div>
        );
        case '맛집정보':
        return (
          <div className="tab-content">
            <form className="restaurant-info-form">
              <div className="form-row">
                <label>사업자명</label>
                <input type="text" placeholder="사업자명을 입력해주세요." />
                <span>식당 대표 성명입니다.</span>
              </div>
              <div className="form-row">
                <label>식당명</label>
                <input type="text" placeholder="식당명을 입력해주세요." />
                <span>회원에게 공개될 식당의 이름입니다. **30일 이후 변경이 가능합니다.</span>
              </div>
              <div className="form-row">
                <label>주소</label>
                <input type="text" placeholder="주소를 입력해주세요." />
                <span>식당의 도로명 주소입니다.</span>
              </div>
              <div className="form-row">
                <label>상세주소</label>
                <input type="text" placeholder="상세주소를 입력해주세요." />
                <span>식당의 추가적인 주소 기입사항입니다.</span>
              </div>
              <div className="form-row">
                <label>상호명</label>
                <input type="text" placeholder="상호명을 입력해주세요." />
                <span>사업체로 등록한 식당의 상호명입니다.</span>
              </div>
              <div className="form-row">
                <label>분류</label>
                <select>
                  <option>분류를 선택해주세요.</option>
                  <option>한식</option>
                  <option>중식</option>
                  <option>일식</option>
                  <option>양식</option>
                  <option>기타</option>
                </select>
                <span>식당이 분류될 카테고리입니다.</span>
              </div>
              <div className="form-row">
                <label>전화번호</label>
                <input type="tel" placeholder="전화번호를 입력해주세요." />
                <span>사용자가 거주중인 주소입니다.</span>
              </div>
              <div className="form-row">
                <label>영업시간</label>
                <div className="time-range">
                  <input type="time" /> ~ <input type="time" />
                </div>
                <span>식당이 운영되는 시간을 알려주세요.</span>
              </div>
              <div className="form-row">
                <label>포장 가능</label>
                <input type="checkbox" />
                <span>음식 배달 가능 여부를 체크해주세요.</span>
              </div>
              <div className="form-row">
                <label>주차 가능</label>
                <input type="checkbox" />
                <span>주차가 가능한 식당을 체크해주세요.</span>
              </div>
            </form>
          </div>
        );
      case '맛집정보':
        return (
          <div className="tab-content">
            <form className="restaurant-info-form">
              <div className="form-row">
                <label>사업자명</label>
                <input type="text" placeholder="사업자명을 입력해주세요." />
                <span>식당 대표 성명입니다.</span>
              </div>
              <div className="form-row">
                <label>식당명</label>
                <input type="text" placeholder="식당명을 입력해주세요." />
                <span>회원에게 공개될 식당의 이름입니다. **30일 이후 변경이 가능합니다.</span>
              </div>
              <div className="form-row">
                <label>주소</label>
                <input type="text" placeholder="주소를 입력해주세요." />
                <span>식당의 도로명 주소입니다.</span>
              </div>
              <div className="form-row">
                <label>상세주소</label>
                <input type="text" placeholder="상세주소를 입력해주세요." />
                <span>식당의 추가적인 주소 기입사항입니다.</span>
              </div>
              <div className="form-row">
                <label>상호명</label>
                <input type="text" placeholder="상호명을 입력해주세요." />
                <span>사업체로 등록한 식당의 상호명입니다.</span>
              </div>
              <div className="form-row">
                <label>분류</label>
                <select>
                  <option>분류를 선택해주세요.</option>
                  <option>한식</option>
                  <option>중식</option>
                  <option>일식</option>
                  <option>양식</option>
                  <option>기타</option>
                </select>
                <span>식당이 분류될 카테고리입니다.</span>
              </div>
              <div className="form-row">
                <label>전화번호</label>
                <input type="tel" placeholder="전화번호를 입력해주세요." />
                <span>사용자가 거주중인 주소입니다.</span>
              </div>
              <div className="form-row">
                <label>영업시간</label>
                <div className="time-range">
                  <input type="time" /> ~ <input type="time" />
                </div>
                <span>식당이 운영되는 시간을 알려주세요.</span>
              </div>
              <div className="form-row">
                <label>포장 가능</label>
                <input type="checkbox" />
                <span>음식 배달 가능 여부를 체크해주세요.</span>
              </div>
              <div className="form-row">
                <label>주차 가능</label>
                <input type="checkbox" />
                <span>주차가 가능한 식당을 체크해주세요.</span>
              </div>
            </form>
          </div>
        );
        case '예약관리':
        return (
          <div className="tab-content">
            <form className="reservation-info-form">
              <div className="form-row">
                <label>예약 인원</label>
                <div className="inline-inputs">
                  <select>
                    <option>00명</option>
                  </select>
                  ~
                  <select>
                    <option>00명</option>
                  </select>
                </div>
                <span>예약 가능한 최대, 최소 인원입니다.</span>
              </div>
              <div className="form-row">
                <label>예약 인원</label>
                <div className="inline-inputs">
                  <select>
                    <option>00팀</option>
                  </select>
                  ~
                  <select>
                    <option>00명</option>
                  </select>
                </div>
                <span>최대 대기 시간 / 최대 예약 인원입니다.</span>
              </div>
              <div className="form-row">
                <label>예약 요일</label>
                <div className="weekday-checkboxes">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                    <label key={day}>
                      <input type="checkbox" />
                      {day}
                    </label>
                  ))}
                </div>
                <span>예약이 가능한 요일입니다.</span>
              </div>
              <div className="form-row">
                <label>예약 설명</label>
                <textarea placeholder="예약 설명을 입력해주세요." />
                <span>예약창 최상단에 입력되는 예약 설명 문구입니다.</span>
              </div>
              <div className="form-row">
                <label>식사 시간</label>
                <select>
                  <option>00시간 00분</option>
                </select>
                <span>식당의 회전률 및 다음 예약 시간을 조정합니다.</span>
              </div>
              <div className="form-row">
                <label>정비 시간</label>
                <select>
                  <option>00시간 00분</option>
                </select>
                <span>식사 완료 이후 다음 예약 시간을 조정합니다.</span>
              </div>
              <div className="form-row">
                <label>요청 가능</label>
                <input type="checkbox" />
                <span>예약자가 추가적인 요구가 가능하도록 문구 작성 페이지를 제공합니다.</span>
              </div>
            </form>
          </div>
        );
      default:
        return <div className="tab-content">내용이 없습니다.</div>;
    }
  };

  return (
    <div className="owner-info-page">
      <nav className="navbar">
        <div className="logo">MaZZip!</div>
      </nav>
      <div className="main-content">
        <h1 className="page-title">점주 관리</h1>
        <div className="tab-bar">
          {['점주정보', '맛집정보', '리뷰관리', '예약관리'].map((tab) => (
            <div
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default OwnerInfoPage;
