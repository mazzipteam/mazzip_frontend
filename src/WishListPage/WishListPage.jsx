import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./WishListPage.module.css";

const WishListPage = () => {
  const exampleWishList = [
    {
      id: 1,
      name: "이탈리안 레스토랑",
      rating: 4.6,
      reviews: 150,
      cuisine: "양식",
      address: "서울특별시 강남구 1번지",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "한식 전문점",
      rating: 4.8,
      reviews: 200,
      cuisine: "한식",
      address: "서울특별시 종로구 2번지",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "중식 레스토랑",
      rating: 4.4,
      reviews: 120,
      cuisine: "중식",
      address: "서울특별시 동대문구 3번지",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "퓨전 레스토랑",
      rating: 4.7,
      reviews: 180,
      cuisine: "퓨전",
      address: "서울특별시 서초구 4번지",
      image: "https://via.placeholder.com/150",
    },
  ];

  const [wishListItems, setWishListItems] = useState([]);

  useEffect(() => {
    // 실제 API 연결 부분 (현재는 주석 처리)
    // fetch(`/api/v1/bookmark/all/user/${userId}`)
    //   .then((response) => response.json())
    //   .then((data) => setWishListItems(data))
    //   .catch((error) => console.error("Error fetching wishlist:", error));

    // 예시 데이터를 세팅
    setWishListItems(exampleWishList);
  }, []);

  return (
    <div className={styles.wishlistPage}>
      <h2 className={styles.wishlistTitle}>찜 목록</h2>
      <div className={styles.wishlistItems}>
        {wishListItems.length === 0 ? (
          <p>찜한 항목이 없습니다.</p>
        ) : (
          wishListItems.map((item) => (
            <Link
              to={`/restaurant/${item.id}`}
              key={item.id}
              className={styles.wishlistItemLink}
            >
              <div className={styles.wishlistItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemLogo}
                />
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemCuisine}>{item.cuisine}</p>
                  <p className={styles.itemRating}>⭐ {item.rating} / 5</p>
                  <p className={styles.itemReviews}>리뷰 {item.reviews}개</p>
                  <p className={styles.itemAddress}>{item.address}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default WishListPage;








//아래 코드는 데이터셋이 restaurantId,logo,name,rating 밖에 없음. 만약 api 반환값이 이거 네개라면 그냥 아래거 사용할것.

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import styles from "./WishListPage.module.css";

// const WishListPage = () => {
//   const exampleWishList = [
//     {
//       restaurant: {
//         restaurantId: 1,
//         logo: "example-logo1.png",
//         name: "Restaurant A",
//         rating: 4.5,
//       },
//     },
//     {
//       restaurant: {
//         restaurantId: 2,
//         logo: "example-logo2.png",
//         name: "Restaurant B",
//         rating: 4.2,
//       },
//     },
//     {
//       restaurant: {
//         restaurantId: 3,
//         logo: "example-logo3.png",
//         name: "Restaurant C",
//         rating: 4.8,
//       },
//     },
//   ];

//   const [wishListItems, setWishListItems] = useState([]);

//   useEffect(() => {
//     // 실제 API 연결 부분 (현재는 주석 처리)
//     // fetch(`/api/v1/bookmark/all/user/${userId}`)
//     //   .then((response) => response.json())
//     //   .then((data) => setWishListItems(data))
//     //   .catch((error) => console.error("Error fetching wishlist:", error));

//     // 예시 데이터를 세팅
//     setWishListItems(exampleWishList);
//   }, []);

//   return (
//     <div className={styles.wishlistPage}>
//       <h2 className={styles.wishlistTitle}>찜 목록</h2>
//       <div className={styles.wishlistItems}>
//         {wishListItems.length === 0 ? (
//           <p>찜한 항목이 없습니다.</p>
//         ) : (
//           wishListItems.map((item, index) => (
//             <Link
//               to={`/restaurant/${item.restaurant.restaurantId}`}
//               key={index}
//               className={styles.wishlistItemLink}
//             >
//               <div className={styles.wishlistItem}>
//                 <img
//                   src={`images/${item.restaurant.logo}`}
//                   alt={item.restaurant.name}
//                   className={styles.itemLogo}
//                 />
//                 <div className={styles.itemInfo}>
//                   <p className={styles.itemName}>{item.restaurant.name}</p>
//                   <p className={styles.itemRating}>⭐ {item.restaurant.rating}</p>
//                 </div>
//               </div>
//             </Link>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default WishListPage;
