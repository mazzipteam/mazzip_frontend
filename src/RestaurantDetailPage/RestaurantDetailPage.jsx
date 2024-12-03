import React, { useState } from "react";
import "./RestaurantDetailPage.css";

const restaurantData = {
  images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
  name: "안목",
  address: "수영구 광남로 22번길 3, Seoul, 48307, 대한민국",
  phone: "010-8380-8023",
  menu: [
    {
      image: "/menu1.jpg",
      name: "고기국밥",
      price: "11,000원",
    },
    {
      image: "/menu2.jpg",
      name: "얼큰해장국밥",
      price: "12,000원",
    },
    {
      image: "/menu3.jpg",
      name: "암뽕국밥",
      price: "11,000원",
    },
    {
      image: "/menu4.jpg",
      name: "소고기국밥",
      price: "11,000원",
    },
    { 
      image: "/menu5.jpg",
      name: "순대국밥",
      price: "11,000원",
    }
  ],
  reviewSummary: {
    averageRating: 4.2,
    ratingCounts: {
      "5": 275,
      "4": 296,
      "3": 150,
      "2": 50,
      "1": 20,
    },
    valueReviews: {
      positive: 80,
      negative: 20,
    },
  },
  reviews: [
    {
      username: "맛도리김치",
      rating: 5,
      image: "/review1.jpg",
      date: "2024-11-28",
      content: "맛있다고 유명한 이유가 있네요! 얼큰해장국밥 정말 추천합니다.",
      reply: "소중한 리뷰 감사합니다! 다음에도 만족하실 수 있도록 노력하겠습니다.",
    },
    {
      username: "김현상우",
      rating: 4,
      image: "/review2.jpg",
      date: "2024-11-27",
      content: "가격 대비 양은 괜찮아요. 국물 맛이 깊습니다.",
      reply: null,
    },
  ],
};

const RestaurantDetailPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    username: "",
    rating: "",
    content: "",
    image: null, // Image file
  });
  const [previewImage, setPreviewImage] = useState(null); // For previewing the image

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPreviewImage(null); // Reset the preview image
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
      setNewReview((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file)); // Generate a URL for preview
    }
  };

  const handleAddReview = () => {
    const formData = new FormData();
    formData.append("username", newReview.username);
    formData.append("rating", newReview.rating);
    formData.append("content", newReview.content);
    if (newReview.image) {
      formData.append("image", newReview.image); // Add the image file
    }

    // Simulate adding the review (you can replace this with an API call)
    console.log("Submitted FormData:", formData);
    restaurantData.reviews.push({
      username: newReview.username,
      rating: newReview.rating,
      content: newReview.content,
      date: new Date().toISOString().split("T")[0],
      image: previewImage,
      reply: null,
    });

    // Reset the form and close the popup
    handleClosePopup();
  };

  //리뷰 신고 핸들러 함수 : 여기에 서버로 신고 ID 전송해야함
  const handleReportReview = (reviewIndex) => {
  console.log(`리뷰 ${reviewIndex + 1} 신고 처리`);
  alert(`해당 리뷰가 신고되었습니다.`);
  // 추가로 서버로 신고 데이터를 전송하는 API 호출 로직을 구현할 수 있습니다.
  };


  const { images, name, address, phone, menu, reviewSummary, reviews } = restaurantData;

  return (
    <div className="restaurant-detail-page">
      <div className="restaurant-images">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Dish ${index + 1}`} />
        ))}
      </div>

      <div className="restaurant-info">
        <div className="info-left">
          <h1>{name}</h1>
          <p className="address">{address}</p>
          <p className="phone">{phone}</p>
        </div>
        <button className="reserve-button">예약하기</button>
      </div>

      <hr className="divider" />

      <div className="menu-section">
        {menu.map((item, index) => (
          <div className="menu-item" key={index}>
            <img src={item.image} alt={item.name} />
            <p className="menu-name">{item.name}</p>
            <p className="menu-price">{item.price}</p>
          </div>
        ))}
      </div>

      <hr className="divider" />
      {/* Reviews Summary */}
      <div className="review-summary">
        <h3>리뷰 요약</h3>
        <p>평균 평점: ⭐{reviewSummary.averageRating}</p>
        <div className="ratings">
          {Object.entries(reviewSummary.ratingCounts).map(([rating, count]) => (
            <p key={rating}>{rating}점: {count}</p>
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

      {/* Divider */}
      <hr className="divider" />

      <div className="latest-reviews">
  <h3>최신 리뷰</h3>
  {reviews.map((review, index) => (
    <div className="review" key={index}>
      <p className="review-user">
        {review.username} ({review.date})
      </p>
      <img src={review.image} alt="Review" />
      <p className="review-text">{review.content}</p>
      {review.reply && (
        <p className="review-reply">
          <strong>사장님 답글: </strong>{review.reply}
        </p>
      )}
      {/* 리뷰 신고 버튼 */}
      <button
        className="report-button"
        onClick={() => handleReportReview(index)}
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
        이름:
        <input
          type="text"
          name="username"
          value={newReview.username}
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
          name="content"
          value={newReview.content}
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


