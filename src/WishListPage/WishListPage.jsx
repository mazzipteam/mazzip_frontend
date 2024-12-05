// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import styles from "./WishListPage.module.css";

// const WishListPage = () => {
//   const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       if (!userId) {
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:8080/api/v1/bookmark/all/${userId}`);
        
//         if (!response.ok) {
//           throw new Error('북마크 데이터를 가져오는데 실패했습니다.');
//         }

//         const result = await response.json();
//         if (result.code === 200) {
//           const bookmarks = result.data.map(bookmark => bookmark.restaurant);
//           setBookmarkedRestaurants(bookmarks);
//         }
//       } catch (error) {
//         console.error('북마크 데이터 로딩 실패:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookmarks();
//   }, [userId, navigate]);

//   if (loading) {
//     return <div className={styles.loading}>데이터를 불러오는 중...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.wishlistPage}>
//       <h2 className={styles.wishlistTitle}>찜 목록</h2>
//       <div className={styles.wishlistItems}>
//         {bookmarkedRestaurants.length === 0 ? (
//           <p className={styles.noItems}>찜한 식당이 없습니다.</p>
//         ) : (
//           bookmarkedRestaurants.map((restaurant) => (
//             <div 
//               key={restaurant.restaurantId} 
//               className={styles.wishlistItem}
//               onClick={() => navigate(`/restaurant/${restaurant.restaurantId}`)}
//             >
//               <img
//                 src={restaurant.restaurantImage ? 
//                   `data:image/png;base64,${restaurant.restaurantImage.foreGround}` : 
//                   '/default-restaurant-image.jpg'
//                 }
//                 alt={restaurant.name}
//                 className={styles.restaurantImage}
//                 onError={(e) => {
//                   e.target.src = '/default-restaurant-image.jpg';
//                   e.target.onerror = null;
//                 }}
//               />
//               <div className={styles.restaurantInfo}>
//                 <h3 className={styles.restaurantName}>{restaurant.name}</h3>
//                 <p className={styles.category}>{restaurant.category}</p>
//                 <p className={styles.address}>{restaurant.region} {restaurant.address}</p>
//                 <p className={styles.telNum}>{restaurant.telNum}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default WishListPage;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WishListPage.module.css";

const WishListPage = () => {
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://43.201.45.105:8080/api/v1/bookmark/all/${userId}`);
        
        if (!response.ok) {
          throw new Error('북마크 데이터를 가져오는데 실패했습니다.');
        }

        const result = await response.json();
        if (result.code === 200) {
          const bookmarks = result.data.map(bookmark => bookmark.restaurant);
          setBookmarkedRestaurants(bookmarks);
        }
      } catch (error) {
        console.error('북마크 데이터 로딩 실패:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId, navigate]);

  if (loading) {
    return <div className={styles.loading}>데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.wishlistPage}>
      <h2 className={styles.wishlistTitle}>찜한 맛집 목록</h2>
      <div className={styles.wishlistItems}>
        {bookmarkedRestaurants.length === 0 ? (
          <p className={styles.noItems}>아직 찜한 맛집이 없습니다.</p>
        ) : (
          bookmarkedRestaurants.map((restaurant) => (
            <div 
              key={restaurant.restaurantId} 
              className={styles.wishlistItem}
              onClick={() => navigate(`/restaurant/${restaurant.restaurantId}`)}
            >
              <img
                src={restaurant.restaurantImage ? 
                  `data:image/png;base64,${restaurant.restaurantImage.foreGround}` : 
                  '/default-restaurant-image.jpg'
                }
                alt={restaurant.name}
                className={styles.itemLogo}
                onError={(e) => {
                  e.target.src = '/default-restaurant-image.jpg';
                  e.target.onerror = null;
                }}
              />
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{restaurant.name}</p>
                <p className={styles.itemCuisine}>{restaurant.category}</p>
                <p className={styles.itemAddress}>
                  {restaurant.region} {restaurant.address}
                </p>
                <p className={styles.itemContact}>{restaurant.telNum}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishListPage;