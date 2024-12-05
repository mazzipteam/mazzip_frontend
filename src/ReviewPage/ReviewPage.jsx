import React, { useEffect, useState } from "react";
import styles from "./ReviewPage.module.css";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/v1/review/all/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 필요한 경우 인증 토큰 추가
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error('리뷰를 불러오는데 실패했습니다.');
        }

        const result = await response.json();
        setReviews(result.data);
      } catch (err) {
        setError(err.message);
        // 에러 발생 시 빈 배열이나 예시 데이터를 보여줄 수 있습니다
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserReviews();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <div className={styles.loading}>리뷰를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.reviewPage}>
      <h1 className={styles.title}>나의 리뷰</h1>
      {reviews.length === 0 ? (
        <div className={styles.noReviews}>
          작성한 리뷰가 없습니다.
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.reviewId} className={styles.reviewCard}>
            {review.image && (
              <img
                src={`data:image/png;base64,${review.image}`}
                alt="Review"
                className={styles.reviewImage}
                onError={(e) => {
                  e.target.src = '/default-review-image.jpg';
                  e.target.onerror = null;
                }}
              />
            )}
            <div className={styles.reviewContent}>
              <h2 className={styles.reviewTitle}>{review.title}</h2>
              <p className={styles.reviewDescription}>{review.description}</p>
              <p className={styles.rating}>평점: {review.rating} / 5</p>
              <p className={styles.recommend}>
                추천수: {review.recommend}
              </p>
              {review.answer && (
                <div className={styles.answer}>
                  <p className={styles.answerTitle}>사장님 답변</p>
                  <p className={styles.answerContent}>{review.answer}</p>
                </div>
              )}
              <small className={styles.date}>
                작성일: {new Date(review.createdAt).toLocaleDateString()}
              </small>
              <br />
              <small className={styles.date}>
                수정일: {new Date(review.updatedAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewPage;

