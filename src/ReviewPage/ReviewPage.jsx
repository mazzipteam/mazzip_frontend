import React, { useEffect, useState } from "react";
import styles from "./ReviewPage.module.css";

const ReviewPage = () => {
  const exampleReviews = [
    {
      reviewId: 1,
      rating: 5,
      title: "환상적인 음식!",
      description: "분위기도 좋고 음식도 정말 맛있었어요. 또 방문하고 싶어요!",
      createdAt: "2024-01-01T12:00:00",
      updatedAt: "2024-01-02T12:00:00",
      image: "menu1.jpg",
      recommend: 15,
      restaurant: {
        restaurantId: 2001,
        name: "맛있는 한식당",
      },
    },
    {
      reviewId: 2,
      rating: 4,
      title: "좋았지만 조금 아쉬웠어요",
      description: "음식은 괜찮았지만 서비스가 조금 아쉬웠어요.",
      createdAt: "2024-01-03T18:30:00",
      updatedAt: "2024-01-04T20:00:00",
      image: "menu2.jpg",
      recommend: 8,
      restaurant: {
        restaurantId: 2002,
        name: "깔끔한 중식당",
      },
    },
    {
      reviewId: 3,
      rating: 3,
      title: "보통이에요",
      description: "특별히 좋지도 나쁘지도 않은 평범한 맛입니다.",
      createdAt: "2024-01-05T15:00:00",
      updatedAt: "2024-01-06T18:00:00",
      image: "menu3.jpg",
      recommend: 5,
      restaurant: {
        restaurantId: 2003,
        name: "동네 분식집",
      },
    },
  ];

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 실제 API 연결 부분 (현재는 주석 처리)
    // fetch(`/api/v1/review/all/user/${userId}`)
    //   .then((response) => response.json())
    //   .then((data) => setReviews(data))
    //   .catch((error) => console.error("Error fetching reviews:", error));

    // 예시 데이터를 세팅
    setReviews(exampleReviews);
  }, []);

  return (
    <div className={styles.reviewPage}>
      <h1 className={styles.title}>User Reviews</h1>
      {reviews.map((review) => (
        <div key={review.reviewId} className={styles.reviewCard}>
          <img
            src={review.image}
            alt="Review"
            className={styles.reviewImage}
          />
          <div className={styles.reviewContent}>
            <h2 className={styles.reviewTitle}>{review.title}</h2>
            <p className={styles.reviewDescription}>{review.description}</p>
            <p className={styles.restaurantName}>
              Restaurant: <strong>{review.restaurant.name}</strong>
            </p>
            <p className={styles.rating}>Rating: {review.rating} / 5</p>
            <p className={styles.recommend}>
              Recommendations: {review.recommend}
            </p>
            <small className={styles.date}>
              Created At: {new Date(review.createdAt).toLocaleDateString()}
            </small>
            <br />
            <small className={styles.date}>
              Last Updated: {new Date(review.updatedAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewPage;

