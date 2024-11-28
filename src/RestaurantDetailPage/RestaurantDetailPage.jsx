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








// import React from "react";
// import "./RestaurantDetailPage.css";

// const restaurantData = {
//   images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
//   name: "안목",
//   address: "수영구 광남로 22번길 3, Seoul, 48307, 대한민국",
//   phone: "010-8380-8023",
//   menu: [
//     {
//       image: "/menu1.jpg",
//       name: "고기국밥",
//       price: "11,000원",
//     },
//     {
//       image: "/menu2.jpg",
//       name: "얼큰해장국밥",
//       price: "12,000원",
//     },
//     {
//       image: "/menu3.jpg",
//       name: "암뽕국밥",
//       price: "11,000원",
//     },
//     {
//       image: "/menu4.jpg",
//       name: "소고기국밥",
//       price: "11,000원",
//     },
//     {
//       image: "/menu5.jpg",
//       name: "순대국밥",
//       price: "11,000원",
//     }
//   ],
//   reviewSummary: {
//     averageRating: 4.2,
//     ratingCounts: {
//       "5": 275,
//       "4": 296,
//       "3": 150,
//       "2": 50,
//       "1": 20,
//     },
//     valueReviews: {
//       positive: 80,
//       negative: 20,
//     },
//   },
//   reviews: [
//     {
//       username: "맛도리김치",
//       rating: 5,
//       image: "/review1.jpg",
//       date: "2024-11-28",
//       content: "맛있다고 유명한 이유가 있네요! 얼큰해장국밥 정말 추천합니다.",
//       reply: "소중한 리뷰 감사합니다! 다음에도 만족하실 수 있도록 노력하겠습니다.",
//     },
//     {
//       username: "김현상우",
//       rating: 4,
//       image: "/review2.jpg",
//       date: "2024-11-27",
//       content: "가격 대비 양은 괜찮아요. 국물 맛이 깊습니다.",
//       reply: null,
//     },
//   ],
// };




// const RestaurantDetailPage = () => {
//   const {
//     images,
//     name,
//     address,
//     phone,
//     menu,
//     reviewSummary,
//     reviews,
//   } = restaurantData;

//   return (
//     <div className="restaurant-detail-page">
//       {/* Images Section */}
//       <div className="restaurant-images">
//         {images.map((img, index) => (
//           <img key={index} src={img} alt={`Dish ${index + 1}`} />
//         ))}
//       </div>

//       {/* Restaurant Info */}
//       <div className="restaurant-info">
//         <div className="info-left">
//           <h1>{name}</h1>
//           <p className="address">{address}</p>
//           <p className="phone">{phone}</p>
//         </div>
//         <button className="reserve-button">예약하기</button>
//       </div>

//       {/* Divider */}
//       <hr className="divider" />

//       {/* Menu Section */}
//       <div className="menu-section">
//         {menu.map((item, index) => (
//           <div className="menu-item" key={index}>
//             <img src={item.image} alt={item.name} />
//             <p className="menu-name">{item.name}</p>
//             <p className="menu-price">{item.price}</p>
//           </div>
//         ))}
//       </div>

//       {/* Divider */}
//       <hr className="divider" />

      // {/* Reviews Summary */}
      // <div className="review-summary">
      //   <h3>리뷰 요약</h3>
      //   <p>평균 평점: ⭐{reviewSummary.averageRating}</p>
      //   <div className="ratings">
      //     {Object.entries(reviewSummary.ratingCounts).map(([rating, count]) => (
      //       <p key={rating}>{rating}점: {count}</p>
      //     ))}
      //   </div>
      //   <div className="value-buttons">
      //     <button className="btn-positive">
      //       가성비 인정 {reviewSummary.valueReviews.positive}%
      //     </button>
      //     <button className="btn-negative">
      //       미인정 {reviewSummary.valueReviews.negative}%
      //     </button>
      //   </div>
      // </div>

      // {/* Divider */}
      // <hr className="divider" />

//       {/* Latest Reviews */}
//       <div className="latest-reviews">
//         <h3>최신 리뷰</h3>
//         {reviews.map((review, index) => (
//           <div className="review" key={index}>
//             <p className="review-user">
//               {review.username} ({review.date})
//             </p>
//             <img src={review.image} alt="Review" />
//             <p className="review-text">{review.content}</p>
//             {review.reply && (
//               <p className="review-reply">
//                 <strong>사장님 답글: </strong>{review.reply}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//       {/* TO DO : 리뷰추가 버튼 만들기 */}
      
//     </div>
//   );
// };

// export default RestaurantDetailPage;









//아래는 서버에서 이미지를 multipart/form-data 형태로 받는 경우 사용할 코드임

//<GPT>
//클라이언트 측에서 이미지를 처리하기 위해서는 다음과 같은 접근 방식을 고려해야 합니다:
//이미지 URL로 변환: 서버에서 받은 이미지 데이터는 파일 형태이므로, 이를 클라이언트에서 표시하려면 URL.createObjectURL()로 변환하여 이미지 URL로 사용할 수 있습니다.
//수정된 데이터 구조: 이미지를 문자열 배열이 아니라, 파일 데이터를 포함한 객체 배열로 처리해야 합니다.
//변환 로직 추가: restaurantData에 포함된 이미지 데이터를 URL로 변환한 뒤, React 상태로 관리하여 렌더링합니다.

// import React, { useState, useEffect } from "react";
// import "./RestaurantDetailPage.css";

// const restaurantDataFromServer = {
//   images: [
//     // 서버에서 multipart로 받은 이미지 파일 객체들
//     new File(["dummy content"], "img1.jpg"),
//     new File(["dummy content"], "img2.jpg"),
//     new File(["dummy content"], "img3.jpg"),
//   ],
//   name: "안목",
//   address: "수영구 광남로 22번길 3, Seoul, 48307, 대한민국",
//   phone: "010-8380-8023",
//   menu: [
//     {
//       image: new File(["dummy content"], "menu1.jpg"),
//       name: "고기국밥",
//       price: "11,000원",
//     },
//     {
//       image: new File(["dummy content"], "menu2.jpg"),
//       name: "얼큰해장국밥",
//       price: "12,000원",
//     },
//   ],
//   reviewSummary: {
//     averageRating: 4.2,
//     ratingCounts: {
//       "5": 275,
//       "4": 296,
//       "3": 150,
//       "2": 50,
//       "1": 20,
//     },
//     valueReviews: {
//       positive: 80,
//       negative: 20,
//     },
//   },
//   reviews: [
//     {
//       username: "맛도리김치",
//       rating: 5,
//       image: new File(["dummy content"], "review1.jpg"),
//       date: "2024-11-28",
//       content: "맛있다고 유명한 이유가 있네요! 얼큰해장국밥 정말 추천합니다.",
//       reply: "소중한 리뷰 감사합니다! 다음에도 만족하실 수 있도록 노력하겠습니다.",
//     },
//   ],
// };

// const RestaurantDetailPage = () => {
//   const [restaurantData, setRestaurantData] = useState({
//     images: [],
//     name: "",
//     address: "",
//     phone: "",
//     menu: [],
//     reviewSummary: {},
//     reviews: [],
//   });

//   useEffect(() => {
//     // 서버에서 데이터가 로드되었다고 가정하고, 파일 URL로 변환
//     const transformedData = {
//       ...restaurantDataFromServer,
//       images: restaurantDataFromServer.images.map((file) =>
//         URL.createObjectURL(file)
//       ),
//       menu: restaurantDataFromServer.menu.map((item) => ({
//         ...item,
//         image: URL.createObjectURL(item.image),
//       })),
//       reviews: restaurantDataFromServer.reviews.map((review) => ({
//         ...review,
//         image: URL.createObjectURL(review.image),
//       })),
//     };

//     setRestaurantData(transformedData);
//   }, []);

//   const {
//     images,
//     name,
//     address,
//     phone,
//     menu,
//     reviewSummary,
//     reviews,
//   } = restaurantData;

//   return (
//     <div className="restaurant-detail-page">
//       {/* Images Section */}
//       <div className="restaurant-images">
//         {images.map((img, index) => (
//           <img key={index} src={img} alt={`Dish ${index + 1}`} />
//         ))}
//       </div>

//       {/* Restaurant Info */}
//       <div className="restaurant-info">
//         <div className="info-left">
//           <h1>{name}</h1>
//           <p className="address">{address}</p>
//           <p className="phone">{phone}</p>
//         </div>
//         <button className="reserve-button">예약하기</button>
//       </div>

//       {/* Divider */}
//       <hr className="divider" />

//       {/* Menu Section */}
//       <div className="menu-section">
//         {menu.map((item, index) => (
//           <div className="menu-item" key={index}>
//             <img src={item.image} alt={item.name} />
//             <p className="menu-name">{item.name}</p>
//             <p className="menu-price">{item.price}</p>
//           </div>
//         ))}
//       </div>

//       {/* Divider */}
//       <hr className="divider" />

//       {/* Reviews Summary */}
//       <div className="review-summary">
//         <h3>리뷰 요약</h3>
//         <p>평균 평점: {reviewSummary.averageRating}</p>
//         <div className="ratings">
//           {Object.entries(reviewSummary.ratingCounts).map(([rating, count]) => (
//             <p key={rating}>
//               {rating}점: {count}
//             </p>
//           ))}
//         </div>
//         <div className="value-buttons">
//           <button className="btn-positive">
//             가성비 인정 {reviewSummary.valueReviews?.positive}%
//           </button>
//           <button className="btn-negative">
//             미인정 {reviewSummary.valueReviews?.negative}%
//           </button>
//         </div>
//       </div>

//       {/* Divider */}
//       <hr className="divider" />

//       {/* Latest Reviews */}
//       <div className="latest-reviews">
//         <h3>최신 리뷰</h3>
//         {reviews.map((review, index) => (
//           <div className="review" key={index}>
//             <p className="review-user">
//               {review.username} ({review.date})
//             </p>
//             <img src={review.image} alt="Review" />
//             <p className="review-text">{review.content}</p>
//             {review.reply && (
//               <p className="review-reply">
//                 <strong>답글: </strong>
//                 {review.reply}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RestaurantDetailPage;
