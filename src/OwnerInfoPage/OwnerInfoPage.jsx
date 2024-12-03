import React, { useState, useEffect } from 'react';
import './OwnerInfoPage.css';

const OwnerInfoPage = () => {
  const [activeTab, setActiveTab] = useState('점주정보');
  const [restaurantId, setRestaurantId] = useState();
  const userID = localStorage.getItem('userId');

  //점주정보 상태변수
  const [ownerInfo, setOwnerInfo] = useState({
    userId: userID,
    password: '',
    nickName: '',
    telNum: '',
    address: '',
    detailAddress: '',
  });

  // API연결1. useEffect로 점주 정보를 서버에서 가져오기
  // useEffect(() => {
  //   // 서버에서 점주정보를 가져오는 API 호출
  //   fetch('/api/owner-info')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setOwnerInfo(data); // 가져온 데이터를 상태에 저장
  //     })
  //     .catch((error) => {
  //       console.error('점주 정보를 가져오는 중 오류 발생:', error);
  //     });
  // }, []);


  //맛집정보 상태변수
  const [restaurantInfo, setRestaurantInfo] = useState({
    restaurantId : restaurantId,
    name: '',
    address: '',
    businessName: '',
    propritor: '',
    category: '',
    telNum: '',
    takeOut: '',
    userId: '',
  });

  useEffect(() => {
    if (userID) {
      fetch(`http://localhost:8080/api/v1/restaurant/${userID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('restaurantId를 가져오는 데 실패했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          setRestaurantId(data.restaurantId); // 받아온 restaurantId를 상태에 저장
          console.log('받아온 restaurantId:', data.restaurantId);
          console.log(restaurantId);
        })
        .catch((error) => {
          console.error('restaurantId를 가져오는 중 오류 발생:', error);
        });
    } else {
      console.error('로그인 정보가 없습니다.');
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwnerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 리뷰관리 탭에서, 본인가게 전체리뷰 상태변수
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: '김철수',
      content: '음식이 맛있었어요!',
      date: '2024-12-03',
      replyContent: '',
      isReplying: false,
    },
    {
      id: 2,
      author: '이영희',
      content: '서비스가 좋았습니다.',
      date: '2024-12-02',
      replyContent: '',
      isReplying: false,
    },
  ]);
  
  //API연결3.  useEffect로 예약 정보를 서버에서 가져오기
  // useEffect(() => {
  //   // 서버에서 예약정보를 가져오는 API 호출
  //   fetch('/api/reservations')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setReservations(data); // 가져온 데이터를 상태에 저장
  //     })
  //     .catch((error) => {
  //       console.error('예약 정보를 가져오는 중 오류 발생:', error);
  //     });
  // }, []);
  
  //예약관리 탭에서 예약 데이터 관리하는 상태변수
  const [reservations, setReservations] = useState([
    {
      id: 1,
      name: '김철수',
      phone: '010-1234-5678',
      time: '2024-12-03 18:00',
      peopleCount: 4,
    },
    {
      id: 2,
      name: '이영희',
      phone: '010-9876-5432',
      time: '2024-12-03 19:00',
      peopleCount: 2,
    },
  ]);

  
  //API연결4. 점주정보 수정하기 버튼 누를때 api 호출하는 부분. 
  const handleSave = async () => {
    try {
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8080/api/v1/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerInfo), // ownerInfo 데이터를 JSON으로 변환
      });
  
      if (!response.ok) {
        // 서버 응답이 실패한 경우 에러 처리
        const errorData = await response.json();
        console.error('수정 요청 실패:', errorData);
        alert(`수정 요청 실패: ${errorData.message || '알 수 없는 오류'}`);
        return;
      }
  
      // 성공적으로 수정된 데이터 처리
      const data = await response.json();
      console.log('수정된 데이터:', data);
      alert('수정이 성공적으로 완료되었습니다.');
  
      // 필요 시 상태를 초기화하거나 업데이트
      setOwnerInfo(data.data); // 서버에서 반환된 최신 데이터를 상태로 설정
    } catch (error) {
      // 네트워크 오류 등 처리
      console.error('수정 중 오류 발생:', error);
      console.log(ownerInfo);
      alert('수정 중 오류가 발생했습니다. 네트워크를 확인하세요.');
    }
  };
  
  


  //API연결5. 맛집정보 수정하기 버튼 누를때 api 호출하는 부분. 
  const handleRestaurantSave = async () => {
    try {
      // restaurantInfo에 필요한 필드가 비어 있는지 확인
      if (!restaurantInfo.restaurantId) {
        alert('레스토랑 ID가 없습니다. 다시 시도하세요.');
        return;
      }
  
      // 서버로 PATCH 요청 보내기
      const response = await fetch('http://localhost:8080/api/v1/restaurant', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantInfo), // restaurantInfo 객체를 JSON 문자열로 변환
      });
  
      if (!response.ok) {
        // 응답 상태가 성공적이지 않으면 에러 처리
        const errorData = await response.json();
        console.error('맛집 정보 수정 실패:', errorData);
        alert(`수정 실패: ${errorData.message || '알 수 없는 오류'}`);
        return;
      }
  
      // 성공적인 응답 처리
      const data = await response.json();
      console.log('수정된 데이터:', data);
  
      alert('맛집 정보가 성공적으로 수정되었습니다.');
  
      // 상태 업데이트 (필요에 따라 추가 작업 가능)
      setRestaurantInfo(data.data); // 서버에서 반환된 최신 데이터를 상태로 업데이트
    } catch (error) {
      // 네트워크 오류 처리
      console.error('맛집 정보 수정 중 오류 발생:', error);
      alert('수정 중 오류가 발생했습니다. 네트워크를 확인하세요.');
    }
  };
  


  //API연결6. 예약관리 탭에서 "예약 거절" 버튼 클릭 시 해당 예약 거절하고 데이터를 갱신하는 함수
  const handleRejectReservation = (reservationId) => {
    // 서버로 예약 거절 API 요청 보내기
    // fetch(`서버 엔드포인트/${reservationId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('예약 거절 실패');
    //     }
    //     return response.json();
    //   })
    //   .then(() => {
    //     setReservations((prev) =>
    //       prev.filter((reservation) => reservation.id !== reservationId)
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('예약 거절 중 오류 발생:', error);
    //   });

    console.log(`예약 ID ${reservationId} 거절 요청 전송`);
    setReservations((prev) =>
      prev.filter((reservation) => reservation.id !== reservationId)
    );
    alert(`해당 예약이 거절되었습니다.`);
  };


  //텍스트와 셀렉트박스 변경을 처리하는 함수
  const handleRestaurantChange = (e) => {
    const { name, value } = e.target;
    setRestaurantInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  //체크박스 변경을 처리하는 함수
  const handleRestaurantCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setRestaurantInfo((prev) => ({
      ...prev,
      [name]: checked ? 'Y' : 'N', // checked 상태를 Y 또는 N으로 변환
    }));
  };

  //답글 달기 버튼 클릭 시 isReplying을 true로 변경하여 답글 입력 폼을 표시
  const handleReplyClick = (id) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, isReplying: true } : review
      )
    );
  };

  //답글 입력 값을 상태에 저장
  const handleReplyChange = (e, id) => {
    const value = e.target.value;
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, replyContent: value } : review
      )
    );
  };

  //API연결7. 리뷰 화면 답글 보내는 함수-> 작성 완료 버튼 클릭 시 API 요청을 보냄(주석처리됨). 요청 후 상태를 업데이트하여 답글 입력 폼을 숨김.
  const handleSubmitReply = (id) => {
    const review = reviews.find((r) => r.id === id);
  
    // 서버로 답글 보내기 API 요청
    // fetch(`서버 엔드포인트/reviews/${id}/reply`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ reply: review.replyContent }),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('답글 작성 실패');
    //     }
    //     return response.json();
    //   })
    //   .then(() => {
    //     alert('답글이 성공적으로 등록되었습니다.');
    //     setReviews((prev) =>
    //       prev.map((r) =>
    //         r.id === id ? { ...r, isReplying: false, replyContent: '' } : r
    //       )
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('답글 등록 중 오류 발생:', error);
    //   });
  
    console.log(`리뷰 ID ${id}에 대한 답글: ${review.replyContent}`);
    alert('답글이 성공적으로 등록되었습니다.');
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isReplying: false, replyContent: '' } : r
      )
    );
  };

  const [notificationMessage, setNotificationMessage] = useState('');

  const handleNotificationChange = (e) => {
    setNotificationMessage(e.target.value);
  };

  const handleSendNotification = () => {
    if (notificationMessage.trim() === '') {
      alert('알림 내용을 입력하세요.');
      return;
    }

    // 서버로 알림 발송 API 호출
    // fetch('서버 엔드포인트', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ message: notificationMessage }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('알림 발송 성공:', data);
    //   })
    //   .catch((error) => {
    //     console.error('알림 발송 중 오류 발생:', error);
    //   });

    console.log('발송된 알림 내용:', notificationMessage);
    alert('알림이 발송되었습니다.');
    setNotificationMessage('');
  };
  


  const renderContent = () => {
    switch (activeTab) {
      case '점주정보':
        return (
          <div className="tab-content">
            <form className="owner-info-form">
              <div className="form-row">
                <label>비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={ownerInfo.password}
                  onChange={handleChange}
                  placeholder="user1234"
                />
              </div>
              <div className="form-row">
                <label>별명</label>
                <input
                  type="text"
                  name="nickName"
                  value={ownerInfo.nickName}
                  onChange={handleChange}
                  placeholder="마찜마켓"
                />
              </div>
              <div className="form-row">
                <label>전화번호</label>
                <input
                  type="tel"
                  name="telNum"
                  value={ownerInfo.telNum}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="form-row">
                <label>주소</label>
                <input
                  type="text"
                  name="address"
                  value={ownerInfo.address}
                  onChange={handleChange}
                  placeholder="서울특별시 삼성교로17"
                />
              </div>
              <div className="form-row">
                <label>상세 주소</label>
                <input
                  type="text"
                  name="detailAddress"
                  value={ownerInfo.detailAddress}
                  onChange={handleChange}
                  placeholder="0000동 0000호"
                />
              </div>
              <div className="form-row">
                <button type="button" className="save-button" onClick={handleSave}>
                  수정하기
                </button>
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
                  <input
                    type="text"
                    name="name"
                    value={restaurantInfo.name}
                    onChange={handleRestaurantChange}
                    placeholder="사업자명을 입력해주세요."
                  />
                  <span>식당 대표 성명입니다.</span>
                </div>
                <div className="form-row">
                  <label>식당명</label>
                  <input
                    type="text"
                    name="businessName"
                    value={restaurantInfo.businessName}
                    onChange={handleRestaurantChange}
                    placeholder="식당명을 입력해주세요."
                  />
                  <span>회원에게 공개될 식당의 이름입니다. **30일 이후 변경이 가능합니다.</span>
                </div>
                <div className="form-row">
                  <label>주소</label>
                  <input
                    type="text"
                    name="address"
                    value={restaurantInfo.address}
                    onChange={handleRestaurantChange}
                    placeholder="주소를 입력해주세요."
                  />
                  <span>식당의 도로명 주소입니다.</span>
                </div>
                <div className="form-row">
                  <label>분류</label>
                  <select
                    name="category"
                    value={restaurantInfo.category}
                    onChange={handleRestaurantChange}
                  >
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
                  <input
                    type="tel"
                    name="telNum"
                    value={restaurantInfo.telNum}
                    onChange={handleRestaurantChange}
                    placeholder="전화번호를 입력해주세요."
                  />
                  <span>사용자가 거주중인 주소입니다.</span>
                </div>
                <div className="form-row">
                  <label>포장 가능</label>
                  <input
                    type="checkbox"
                    name="takeOut"
                    checked={restaurantInfo.takeOut}
                    onChange={handleRestaurantCheckboxChange}
                  />
                  <span>음식 포장 가능 여부를 체크해주세요.</span>
                </div>
                <div className="form-row">
                  <button type="button" className="save-button" onClick={handleRestaurantSave}>
                    수정하기
                  </button>
                </div>
              </form>
            </div>
          );

          case '리뷰관리':
            return (
              <div className="tab-content">
                <div className="review-list">
                  <h2>리뷰 관리</h2>
                  {reviews.length === 0 ? (
                    <p>현재 리뷰가 없습니다.</p>
                  ) : (
                    <ul>
                      {reviews.map((review) => (
                        <li key={review.id} className="review-item">
                          <div className="review-details">
                            <p><strong>작성자:</strong> {review.author}</p>
                            <p><strong>내용:</strong> {review.content}</p>
                            <p><strong>작성일:</strong> {review.date}</p>
                          </div>
                          {!review.isReplying ? (
                            <button
                              className="reply-button"
                              onClick={() => handleReplyClick(review.id)}
                            >
                              답글 달기
                            </button>
                          ) : (
                            <div className="reply-form">
                              <textarea
                                value={review.replyContent}
                                onChange={(e) => handleReplyChange(e, review.id)}
                                placeholder="답글 내용을 입력하세요."
                              ></textarea>
                              <button
                                className="submit-reply-button"
                                onClick={() => handleSubmitReply(review.id)}
                              >
                                작성 완료
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          
        case '예약관리':
          return (
            <div className="tab-content">
              <div className="reservation-list">
                <h2>현재 예약 목록</h2>
                {reservations.length === 0 ? (
                  <p>현재 예약이 없습니다.</p>
                ) : (
                  <ul>
                    {reservations.map((reservation) => (
                      <li key={reservation.id} className="reservation-item">
                        <div className="reservation-details">
                          <p><strong>예약자:</strong> {reservation.name}</p>
                          <p><strong>전화번호:</strong> {reservation.phone}</p>
                          <p><strong>예약 시간:</strong> {reservation.time}</p>
                          <p><strong>인원:</strong> {reservation.peopleCount}명</p>
                        </div>
                        <button
                          className="reject-button"
                          onClick={() => handleRejectReservation(reservation.id)}
                        >
                          예약 거절
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
          case '알림 발송':
        return (
          <div className="tab-content">
            <h2>알림 발송</h2>
            <div className="notification-form">
              <textarea
                className="notification-textarea"
                value={notificationMessage}
                onChange={handleNotificationChange}
                placeholder="발송할 알림 내용을 입력하세요."
              ></textarea>
              <button
                className="send-notification-button"
                onClick={handleSendNotification}
              >
                발송
              </button>
            </div>
          </div>
        );

      default:
        return <div className="tab-content">내용이 없습니다.</div>;
    }
  };

  return (
    <div className="owner-info-page">
      {/* <nav className="navbar">
        <div className="logo">MaZZip!</div>
      </nav> */}
      <div className="main-content">
        <h1 className="page-title">점주 관리</h1>
        <div className="tab-bar">
          {['점주정보', '맛집정보', '리뷰관리', '예약관리', '알림 발송'].map((tab) => (
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
