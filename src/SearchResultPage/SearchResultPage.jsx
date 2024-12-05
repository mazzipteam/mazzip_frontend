import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResultPage.css';
import NavBar from '../NavBar/NavBar'; // 상단바 추가


const SearchResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://43.201.45.105:8080/api/v1/restaurant');
        const result = await response.json();
        setRestaurants(result.data || []);
      } catch (error) {
        console.error('식당 데이터 로딩 실패:', error);
        setRestaurants([]);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    setSearchQuery(query || '');

    // 검색어가 있는 경우 필터링, 없는 경우 전체 데이터 표시
    const filteredResults = query
  ? restaurants.filter((restaurant) =>
      restaurant.name.includes(query)
    )
  : restaurants;
    setResults(filteredResults);
  }, [location.search, restaurants]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (restaurantId) => {
    console.log("Clicked restaurant ID:", restaurantId);
    if (restaurantId) {
      navigate(`/restaurant/${restaurantId}`);
    }
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('q', searchQuery);
    navigate(`?${queryParams.toString()}`);
  };

  const getImageUrl = (restaurant) => {
    if (restaurant.restaurantImage && restaurant.restaurantImage.foreGround) {
      return `data:image/png;base64,${restaurant.restaurantImage.foreGround}`;
    }
    return '/default-restaurant-image.jpg';
  };

  return (
    <div className="search-result-page">
      <NavBar /> {/* 상단바 추가 */}

      {/* 가게 결과 카드 */}
      <div className="results-container">
      {currentResults.map((restaurant) => (
        <div
          className="result-card"
          key={restaurant.restaurantId}  // id 대신 restaurantId 사용
          onClick={() => handleCardClick(restaurant.restaurantId)} // id 대신 restaurantId 사용
        >
            <img src={getImageUrl(restaurant)} 
            alt={restaurant.name} />
            <div className="result-info">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.category}</p>
              <p>{restaurant.address}</p>
              <p>{restaurant.telNum}</p>
              {restaurant.takeOut === 'Y' && <p>포장 가능</p>}
            </div>
          </div>
        ))}
      </div>

      {/* 검색창 및 콤보박스 */}
      <div className="search-controls">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
        <select>
          <option value="default">기본 정렬</option>
          <option value="rating">평점 높은 순</option>
          <option value="reviews">리뷰 많은 순</option>
        </select>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(results.length / resultsPerPage) },
          (_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;
