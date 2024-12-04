import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./RestaurantDetailPage.css";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({
    images: [],
    name: '',
    address: '',
    phone: '',
    menu: []
  });

  const [reviews, setReviews] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
          menu: restaurantData.menu || []
        });
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/review/all/restaurant/${id}`);
        const reviewsData = response.data.data;

        console.log("Review Data:", reviewsData);

        const processedReviews = reviewsData.map(review => {

          console.log("Review image data:", review.image);

          return{
          ...review,
          imageUrl: review.image ? `data:image/png;base64,${review.image}` : null
          };

        });

        console.log("Processed Reviews:", processedReviews);

        setReviews(processedReviews);
        
        // Calculate review summary
        const ratingCounts = {};
        let totalRating = 0;
        let positiveValue = 0;
        let totalValueReviews = 0;

        reviewsData.forEach(review => {
          // Count ratings
          ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
          totalRating += review.rating;
          
          // Count value reviews if they exist
          if (review.valueReview) {
            totalValueReviews++;
            if (review.valueReview === 'positive') positiveValue++;
          }
        });

        setReviewSummary({
          averageRating: reviewsData.length ? (totalRating / reviewsData.length).toFixed(1) : 0,
          ratingCounts,
          valueReviews: {
            positive: totalValueReviews ? ((positiveValue / totalValueReviews) * 100).toFixed(0) : 0,
            negative: totalValueReviews ? (((totalValueReviews - positiveValue) / totalValueReviews) * 100).toFixed(0) : 0
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

  const handleAddReview = async () => {
    try {

      const formData = new FormData();

      const reviewCreateDTO = {
        restaurantId: id,
        title: newReview.title,
        rating: parseInt(newReview.rating),
        description: newReview.description,
        userId: 1  // 필요한 경우 실제 userId로 변경
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
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('리뷰 등록에 실패했습니다.');
    }
  };

  const handleReportReview = (reviewIndex) => {
    console.log(`리뷰 ${reviewIndex + 1} 신고 처리`);
    alert(`해당 리뷰가 신고되었습니다.`);
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
        <button className="reserve-button">예약하기</button>
      </div>

      <hr className="divider" />

      <div className="menu-section">
        {restaurant.menu && restaurant.menu.map((item, index) => (
          <div className="menu-item" key={index}>
            <img src={item.image} alt={item.name} />
            <p className="menu-name">{item.name}</p>
            <p className="menu-price">{item.price}</p>
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
              <button
                className="btn-positive"
                onClick={() => console.log("가성비 인정")}
              >
                가성비 인정
              </button>
              <button
                className="btn-negative"
                onClick={() => console.log("가성비 인정 안함")}
              >
                가성비 인정 안함
              </button>
            </div>
            <div className="popup-buttons">
              <button onClick={handleAddReview}>등록</button>
              <button onClick={handleClosePopup}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;