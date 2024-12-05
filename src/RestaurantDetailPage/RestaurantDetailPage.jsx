import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./RestaurantDetailPage.css";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [restaurant, setRestaurant] = useState({
    images: [],
    name: '',
    address: '',
    phone: '',
    menus: []
  });

  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [recommendValue, setRecommendValue] = useState(null);

  const [bookmarkId, setBookmarkId] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reportForm, setReportForm] = useState({
    title: '',
    category: '욕설',  // 기본값 설정
    description: ''
  });
  const [newReview, setNewReview] = useState({
    username: "",
    rating: "",
    content: "",
    image: null,
    title: "",
    description:""
  });

  

  const [reviewSummary, setReviewSummary] = useState({  // Added reviewSummary state
    averageRating: 0,
    ratingCounts: {
      1: 0,  // 모든 점수를 0으로 초기화
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    valueReviews: {
      positive: 0,
      negative: 0
    }
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/bookmark/all/${userId}`);
        const bookmarks = response.data.data;
        const currentBookmark = bookmarks.find(bookmark => bookmark.restaurant.restaurantId === parseInt(id));
        
        if (currentBookmark) {
          setIsBookmarked(true);
          setBookmarkId(currentBookmark.bookmarkId);
        } else {
          setIsBookmarked(false);
          setBookmarkId(null);
        }
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };
  
    if (userId && id) {
      fetchBookmarkStatus();
    }
  }, [userId, id]);

  const handleBookmark = async () => {
    try {
      if (isBookmarked && bookmarkId) {
        // 북마크 삭제
        const response = await axios.delete(`http://localhost:8080/api/v1/bookmark/${bookmarkId}`);
        
        if (response.data.code === 200) {
          setIsBookmarked(false);
          setBookmarkId(null);
          alert('북마크가 삭제되었습니다.');
        }
      } else {
        // 북마크 추가
        const bookmarkData = {
          userId: parseInt(userId),
          restaurantId: parseInt(id)
        };
  
        const response = await axios.post(
          'http://localhost:8080/api/v1/bookmark',
          bookmarkData
        );
  
        if (response.data.code === 200) {
          setIsBookmarked(true);
          setBookmarkId(response.data.data.bookmarkId);
          alert('북마크가 추가되었습니다.');
        }
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
      alert(isBookmarked ? '북마크 삭제에 실패했습니다.' : '북마크 추가에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/restaurant/${id}`);
        const restaurantData = response.data.data;
        
        const imageArray = [
          restaurantData.restaurantImage.foreGround,
          restaurantData.restaurantImage.interior,
          restaurantData.restaurantImage.menu
        ].filter(img => img) // null이나 undefined인 이미지 제거
          .map(img => `data:image/png;base64,${img}`); // base64 이미지 형식으로 변환
        

        setRestaurant({
          images: imageArray,
          name: restaurantData.name,
          address: restaurantData.address,
          phone: restaurantData.telNum,
          menus: restaurantData.menus || []
        });
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/review/all/restaurant/${id}`);
        const reviewsData = response.data.data;

        const processedReviews = reviewsData.map(review => {

          return{
          ...review,
          imageUrl: review.image ? `data:image/png;base64,${review.image}` : null
          };

        });

        setReviews(processedReviews);
        
        // Calculate review summary
        const ratingCounts = {};
        let totalRating = 0;
        let recommendCount = 0;
        let totalReviews = reviewsData.length;
        reviewsData.forEach(review => {
          // Count ratings
          ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
          totalRating += review.rating;
          
          // Count value reviews if they exist
          if (review.recommend === 1) {
            recommendCount++;
          }
        });
    
        // 가성비 맛집 비율 계산
        const positivePercent = totalReviews > 0 ? 
          ((recommendCount / totalReviews) * 100).toFixed(0) : 0;
        const negativePercent = totalReviews > 0 ? 
          (((totalReviews - recommendCount) / totalReviews) * 100).toFixed(0) : 0;

          setReviewSummary({
            averageRating: totalReviews ? (totalRating / totalReviews).toFixed(1) : 0,
            ratingCounts,
            valueReviews: {
              positive: positivePercent,
              negative: negativePercent
            }
          });
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (id) {
      fetchRestaurantData();
      fetchReviews();
    }
  }, [id]);
  

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPreviewImage(null);
    setNewReview({
      username: "",
      rating: "",
      content: "",
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        // Base64 문자열에서 헤더 부분 제거
        const base64Data = base64String.split(',')[1];
        setNewReview(prev => ({
          ...prev,
          image: base64Data
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReservation = () => {
    navigate(`/reservation/${id}`); // MyReservationPage로 이동
  };

  const handleRecommendSelect = async (value) => {
    try {
      setRecommendValue(value);

      const formData = new FormData();

      const reviewCreateDTO = {
        restaurantId: id,
        title: newReview.title,
        rating: parseInt(newReview.rating),
        description: newReview.description,
        userId: parseInt(userId),
        recommend: parseInt(value)
      };
      
      // FormData에 데이터 추가
      formData.append('reviewCreateDTO', JSON.stringify(reviewCreateDTO));
      
      // 이미지가 있는 경우에만 추가
      if (newReview.image) {
        // Base64 문자열을 Blob으로 변환
        const byteString = atob(newReview.image);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/png' });
        
        // FormData에 이미지 추가
        formData.append('image', blob, 'image.png');
      } else {
        // 이미지가 없는 경우 1x1 투명 PNG 생성
        const emptyImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        const byteString = atob(emptyImageBase64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/png' });
        formData.append('image', blob, 'empty.png');
      }
  
      const response = await axios.post(
        `http://localhost:8080/api/v1/review`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.code === 200) {  // success 대신 code === 200 확인
        // 리뷰 목록 새로고침
        const reviewResponse = await axios.get(
          `http://localhost:8080/api/v1/review/all/restaurant/${id}`
        );
        const reviewsData = reviewResponse.data.data;
        const processedReviews = reviewsData.map(review => ({
          ...review,
          imageUrl: review.image ? `data:image/png;base64,${review.image}` : null
        }));
        setReviews(processedReviews);
        
        handleClosePopup();
        alert('리뷰가 성공적으로 등록되었습니다.');
        setIsRecommendModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('리뷰 등록에 실패했습니다.');
      setIsRecommendModalOpen(false);
    }
  };

  const handleReportReview = (reviewId) => {
    setSelectedReviewId(reviewId);
    setIsReportModalOpen(true);
  };

  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitReport = async () => {
    try {
      const reportData = {
        reviewId: selectedReviewId,
        userId: parseInt(userId),
        category: reportForm.category,
        title: reportForm.title,
        description: reportForm.description
      };
  
      const response = await axios.post(
        'http://localhost:8080/api/v1/report',
        reportData
      );
  
      if (response.data.code === 200) {
        alert('신고가 접수되었습니다.');
        setIsReportModalOpen(false);
        setReportForm({
          title: '',
          category: '욕설',
          description: ''
        });
      }
    } catch (error) {
      console.error('신고 처리 중 오류 발생:', error);
      alert('신고 처리에 실패했습니다.');
    }
  };

  const handleAddReview = () => {
    if (!newReview.title || !newReview.rating || !newReview.description) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    setIsRecommendModalOpen(true);
  };

  return (
    <div className="restaurant-detail-page">
      <div className="restaurant-images">
      {restaurant.images && restaurant.images.map((img, index) => (
        <img key={index} src={img} alt={`Restaurant ${index + 1}`} />
      ))}
      </div>

      <div className="restaurant-info">
        <div className="info-left">
          <h1>{restaurant.name}</h1>
          <p className="address">{restaurant.address}</p>
          <p className="phone">{restaurant.phone}</p>
        </div>
        <div className="info-right">
          <button 
            className={`bookmark-button ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmark}
          >
            {isBookmarked ? '북마크됨' : '북마크'}
          </button>
          <button 
            className="reserve-button" 
            onClick={handleReservation}
          >
            예약하기
          </button>
        </div>
        </div>

      <hr className="divider" />

      <div className="menu-section">
        {restaurant.menus && restaurant.menus.map((item, index) => (
          <div className="menu-item" key={item.menuId}>
            <img 
              src={`data:image/png;base64,${item.image}`} 
              alt={item.name} 
            />
            <p className="menu-name">{item.name}</p>
            <p className="menu-price">{item.price.toLocaleString()}원</p>
            <p className="menu-description">{item.description}</p>
            {item.cheap === "Y" && <span className="menu-cheap-tag">가성비</span>}
            {item.main === "Y" && <span className="menu-main-tag">대표메뉴</span>}
          </div>
        ))}
      </div>

      <hr className="divider" />

      <div className="review-summary">
        <h3>리뷰 요약</h3>
        <p>평균 평점: ⭐{reviewSummary.averageRating}</p>
        <div className="ratings">
          {[1, 2, 3, 4, 5].map((rating) => (
            <p key={rating}>
              {rating}점: {reviewSummary.ratingCounts[rating] || 0}
            </p>
          ))}
        </div>
        <div className="value-buttons">
          <button className="btn-positive">
            가성비 인정 {reviewSummary.valueReviews.positive}%
          </button>
          <button className="btn-negative">
            미인정 {reviewSummary.valueReviews.negative}%
          </button>
        </div>
      </div>

      <hr className="divider" />

      <div className="latest-reviews">
        <h3>최신 리뷰</h3>
        {reviews.map((review) => (
          <div className="review" key={review.reviewId}>
            <p className="review-user">
              {review.title} ({review.createdAt})
            </p>
            <p className="review-rating">평점: {review.rating}점</p>
            {review.imageUrl && (
              <div className="review-image">
                <img 
                  src={review.imageUrl}
                  alt="리뷰 이미지" 
                  className="review-img"
                  onError={(e) => {
                    console.error('Image failed to load:', review.imageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="review-text">{review.description}</p>
            {review.answer && (
              <p className="review-reply">
                <strong>사장님 답글: </strong>{review.answer}
              </p>
            )}
            <button 
              className="report-button"
              onClick={() => handleReportReview(review.reviewId)}
            >
              리뷰 신고
            </button>
          </div>
        ))}
      </div>
      {isReportModalOpen && (
  <div className="report-modal-overlay">
    <div className="report-modal">
      <h3>리뷰 신고</h3>
      <div className="report-form">
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={reportForm.title}
            onChange={handleReportInputChange}
            placeholder="신고 제목을 입력해주세요"
          />
        </div>
        
        <div className="form-group">
          <label>신고 카테고리</label>
          <select
            name="category"
            value={reportForm.category}
            onChange={handleReportInputChange}
          >
            <option value="욕설">욕설</option>
            <option value="혐오발언">혐오발언</option>
            <option value="비방">비방</option>
          </select>
        </div>

        <div className="form-group">
          <label>신고 내용</label>
          <textarea
            name="description"
            value={reportForm.description}
            onChange={handleReportInputChange}
            placeholder="신고 내용을 상세히 작성해주세요"
          />
        </div>

        <div className="report-buttons">
          <button 
            className="submit-button"
            onClick={handleSubmitReport}
          >
            신고하기
          </button>
          <button 
            className="cancel-button"
            onClick={() => {
              setIsReportModalOpen(false);
              setReportForm({
                title: '',
                category: '욕설',
                description: ''
              });
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <button className="add-review-button" onClick={handleOpenPopup}>
        리뷰 추가
      </button>

      {isPopupOpen && (
        <div className="review-popup">
          <div className="popup-content">
            <h3>리뷰 작성</h3>
            <label>
              제목:
              <input
                type="text"
                name="title"
                value={newReview.title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              평점:
              <input
                type="number"
                name="rating"
                max="5"
                min="1"
                value={newReview.rating}
                onChange={handleInputChange}
              />
            </label>
            <label>
              내용:
              <textarea
                name="description"
                value={newReview.description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              이미지 업로드:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" />
              </div>
            )}
            <div className="popup-buttons">
              <button onClick={handleAddReview}>등록</button>
              <button onClick={handleClosePopup}>취소</button>
            </div>
          </div>
        </div>
      )}
        {isRecommendModalOpen && (
          <div className="recommend-modal-overlay">
            <div className="recommend-modal">
              <h3>가성비 평가</h3>
              <p>이 식당의 가성비는 어떠신가요?</p>
              <div className="recommend-buttons">
                <button
                  className="recommend-button positive"
                  onClick={() => handleRecommendSelect(1)}
                >
                  가성비 인정
                </button>
                <button
                  className="recommend-button negative"
                  onClick={() => handleRecommendSelect(0)}
                >
                  가성비 미인정
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    
  );
};

export default RestaurantDetailPage;