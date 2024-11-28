


// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './SearchResultPage.css';
// import NavBar from '../NavBar/NavBar'; // 상단바 추가

// const SearchResultPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const resultsPerPage = 16;

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const query = queryParams.get('q');
//     setSearchQuery(query);

//     const sampleResults = Array.from({ length: 50 }, (_, index) => ({
//       id: index + 1, // Add unique ID for each result
//       name: `가게 ${index + 1}`,
//       rating: (Math.random() * 5).toFixed(1),
//       reviews: Math.floor(Math.random() * 500),
//       cuisine: ['한식', '중식', '일식', '양식'][index % 4],
//       address: `서울특별시 강남구 ${index + 1}번지`,
//       image: 'https://via.placeholder.com/150',
//     }));

//     if (query) {
//       const filteredResults = sampleResults.filter((result) =>
//         result.name.includes(query)
//       );
//       setResults(filteredResults);
//     } else {
//       setResults(sampleResults);
//     }
//   }, [location.search]);

//   const indexOfLastResult = currentPage * resultsPerPage;
//   const indexOfFirstResult = indexOfLastResult - resultsPerPage;
//   const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleCardClick = (id) => {
//     // Navigate to the restaurant detail page with the restaurant ID
//     navigate(`/restaurant/${id}`);
//   };

//   return (
//     <div className="search-result-page">
//       <NavBar /> {/* 상단바 추가 */}

//       {/* 가게 결과 카드 */}
//       <div className="results-container">
//         {currentResults.map((result) => (
//           <div
//             className="result-card"
//             key={result.id}
//             onClick={() => handleCardClick(result.id)} // Add onClick handler
//           >
//             <img src={result.image} alt={result.name} />
//             <div className="result-info">
//               <h2>{result.name}</h2>
//               <p>평점: ⭐ {result.rating}</p>
//               <p>리뷰: {result.reviews}개</p>
//               <p>{result.cuisine}</p>
//               <p>{result.address}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 검색창 및 콤보박스 */}
//       <div className="search-controls">
//         <input
//           type="text"
//           placeholder="검색어를 입력하세요"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button>검색</button>
//         <select>
//           <option value="default">기본 정렬</option>
//           <option value="rating">평점 높은 순</option>
//           <option value="reviews">리뷰 많은 순</option>
//         </select>
//       </div>

//       {/* 페이지네이션 */}
//       <div className="pagination">
//         {Array.from(
//           { length: Math.ceil(results.length / resultsPerPage) },
//           (_, index) => (
//             <button
//               key={index}
//               className={currentPage === index + 1 ? 'active' : ''}
//               onClick={() => handlePageChange(index + 1)}
//             >
//               {index + 1}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchResultPage;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResultPage.css';
import NavBar from '../NavBar/NavBar'; // 상단바 추가

// 샘플 데이터셋
const restaurantData = [
  {
    id: 1,
    name: "안목 본점",
    rating: 4.5,
    reviews: 120,
    cuisine: "한식",
    address: "서울특별시 강남구 1번지",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "안목2 혜화지점",
    rating: 4.2,
    reviews: 95,
    cuisine: "중식",
    address: "서울특별시 강남구 2번지",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "일식 전문점",
    rating: 4.8,
    reviews: 200,
    cuisine: "일식",
    address: "서울특별시 강남구 3번지",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "이탈리안 레스토랑",
    rating: 4.6,
    reviews: 150,
    cuisine: "양식",
    address: "서울특별시 강남구 4번지",
    image: "https://via.placeholder.com/150",
  },
  // 더 많은 데이터를 추가하세요
];

const SearchResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 16;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    setSearchQuery(query || '');

    // 검색어가 있는 경우 필터링, 없는 경우 전체 데이터 표시
    const filteredResults = query
      ? restaurantData.filter((restaurant) =>
          restaurant.name.includes(query)
        )
      : restaurantData;

    setResults(filteredResults);
  }, [location.search]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (id) => {
    // Navigate to the restaurant detail page with the restaurant ID
    navigate(`/restaurant/${id}`);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('q', searchQuery);
    navigate(`?${queryParams.toString()}`);
  };

  return (
    <div className="search-result-page">
      <NavBar /> {/* 상단바 추가 */}

      {/* 가게 결과 카드 */}
      <div className="results-container">
        {currentResults.map((result) => (
          <div
            className="result-card"
            key={result.id}
            onClick={() => handleCardClick(result.id)}
          >
            <img src={result.image} alt={result.name} />
            <div className="result-info">
              <h2>{result.name}</h2>
              <p>평점: ⭐ {result.rating}</p>
              <p>리뷰: {result.reviews}개</p>
              <p>{result.cuisine}</p>
              <p>{result.address}</p>
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
