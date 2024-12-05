import React, { useState, useEffect } from "react";
import styles from "./ManagerPage.module.css";
import LoggedInNavBar from "../NavBar/LoggedInNavBar";
import NavBar from "../NavBar/NavBar";

function ManagerPage() {
    // 현재 활성화된 탭 상태를 관리 (기본값은 "approval")
    const [activeTab, setActiveTab] = useState("approval");
    // 회원가입 승인 대기 목록 상태를 관리
    const [signUpList, setSignUpList] = useState([]);
    const [reportList, setReportList] = useState([]);

    const userId = 5; // 하드코딩된 userId

    // activeTab이 "approval"일 때만 회원가입 승인 대기 목록을 가져오기 위한 useEffect 훅
    useEffect(() => {
        if (activeTab === "approval") {
            fetchSignUpRecords();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "report") {
            fetchReportRecords();
        }
    }, [activeTab]);
    


    // 회원가입 승인 대기 목록을 가져오는 함수
    const fetchSignUpRecords = async () => {
        try {
            const response = await fetch(`http://43.201.45.105:8080/api/v1/signup/{userId}?userId=5`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSignUpList(data.data); // "data" 필드에 있는 배열을 signUpList에 설정
            } else {
                console.error("Failed to fetch sign-up records");
            }
        } catch (error) {
            console.error("Error fetching sign-up records:", error);
        }
    };

    // Base64를 Blob으로 변환하는 함수
    const base64ToBlob = (base64, mimeType) => {
        // 데이터 URL 접두사가 있는 경우 제거
        const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

        try {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: mimeType });
        } catch (error) {
            console.error("Base64 문자열 디코딩 오류:", error);
            throw error;
        }
    };


    // 거절 버튼을 눌렀을 때 해당 레코드의 데이터를 삭제하는 함수
    const handleReject = async (item) => {
        try {
            // sign-up 레코드 삭제 API 호출
            const deleteResponse = await fetch(`http://43.201.45.105:8080/api/v1/signup/${item.signUpId}?restaurantId=${item.signUpId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (deleteResponse.ok) {
                console.log("Sign-up record deleted successfully");
                // 성공적으로 sign-up 레코드를 삭제한 후 해당 레코드를 목록에서 제거
                setSignUpList((prevList) => prevList.filter((record) => record.signUpId !== item.signUpId));
            } else {
                console.error("Failed to delete sign-up record");
            }
        } catch (error) {
            console.error("Error deleting sign-up record:", error);
        }
    };


    
    // 승인 버튼을 눌렀을 때 해당 레코드의 데이터를 바탕으로 사용자 생성 및 레스토랑 생성 API 호출
    const handleApprove = async (item) => {
        const userDto = {
            email: item.email,
            password: item.password,
            nickName: item.nickName,
            telNum: item.telNum,
            address: item.address,
            detailAddress: item.detailAddress,
            role: "OWNER",
        };
    
        try {
            // 사용자 생성 API 호출
            const userResponse = await fetch("http://43.201.45.105:8080/api/v1/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDto),
            });
    
            let createdUserId = null;
    
            if (userResponse.ok) {
                const userData = await userResponse.json();
                createdUserId = userData.data.userId;
    
                console.log("User creation successful");
    
                // 레스토랑 생성에 필요한 DTO 생성
                const restaurantDto = {
                    name: item.name,
                    address: item.restaurantAddress,
                    businessName: item.businessName,
                    propritor: item.name,
                    category: "한식",
                    telNum: item.restaurantTelNum,
                    takeOut: "Y",
                    userId: createdUserId,
                };
    
                // FormData 객체 생성
                const formData = new FormData();
                formData.append("restaurantCreateDTO", new Blob([JSON.stringify(restaurantDto)], {
                    type: "application/json",
                }));
    
                if (item.foreGround) {
                    const foreGroundBlob = base64ToBlob(item.foreGround, "image/jpeg");
                    formData.append("multipartFileForeground", foreGroundBlob, "foreground.jpg");
                } else {
                    const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
                    formData.append('multipartFileForeground', emptyBlob, 'empty.txt');
                }
    
                if (item.interior) {
                    const interiorBlob = base64ToBlob(item.interior, "image/jpeg");
                    formData.append("multipartFileInterior", interiorBlob, "interior.jpg");
                } else {
                    const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
                    formData.append('multipartFileInterior', emptyBlob, 'empty.txt');
                }
    
                if (item.menu) {
                    const menuBlob = base64ToBlob(item.menu, "image/jpeg");
                    formData.append("multipartFileMenu", menuBlob, "menu.jpg");
                } else {
                    const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
                    formData.append('multipartFileMenu', emptyBlob, 'empty.txt');
                }
    
                // 레스토랑 생성 API 호출
                const restaurantResponse = await fetch("http://43.201.45.105:8080/api/v1/restaurant", {
                    method: "POST",
                    body: formData,
                });
    
                if (restaurantResponse.ok) {
                    const restaurantData = await restaurantResponse.json();
    
                    if (restaurantData.message === "맛집 생성 성공") {
                        console.log("Restaurant creation successful");
    
                        const restaurantId = restaurantData.data.restaurantId;
    
                        // sign-up 레코드 삭제 API 호출
                        try {
                            const deleteResponse = await fetch(`http://43.201.45.105:8080/api/v1/signup/${item.signUpId}?restaurantId=${item.signUpId}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });

                            if (deleteResponse.ok) {
                                console.log("Sign-up record deleted successfully");
                                // 성공적으로 레스토랑을 생성하고 sign-up 레코드를 삭제한 후 해당 레코드를 목록에서 제거
                                setSignUpList((prevList) => prevList.filter((record) => record.signUpId !== item.signUpId));
                            } else {
                                console.error("Failed to delete sign-up record");
                            }
                        } catch (error) {
                            console.error("Error deleting sign-up record:", error);
                        }

                    }
                } else {
                    console.error("Failed to create restaurant");
                }
            } else {
                console.error("Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user or restaurant:", error);
        }
    };

    const fetchReportRecords = async () => {
        try {
            const response = await fetch("http://43.201.45.105:8080/api/v1/report", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setReportList(data.data); // Assuming the response structure
            } else {
                console.error("Failed to fetch report records");
            }
        } catch (error) {
            console.error("Error fetching report records:", error);
        }
    };


    const handleReportApproval = async (reviewId, reportId) => {
        console.log(reviewId);
        try {
            // 1. 리뷰 삭제
            const reviewResponse = await fetch(`http://43.201.45.105:8080/api/v1/review/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (reviewResponse.ok) {
                const reviewResult = await reviewResponse.json();
                console.log(`Review with ID ${reviewId} deleted successfully`, reviewResult);
    
                // 2. 리포트 삭제
                const reportResponse = await fetch(`http://43.201.45.105:8080/api/v1/report/${reportId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                if (reportResponse.ok) {
                    const reportResult = await reportResponse.json();
                    console.log(`Report with ID ${reportId} deleted successfully`, reportResult);
    
                    // 삭제된 신고를 신고 목록에서 제거
                    setReportList((prevList) => prevList.filter((report) => report.reportId !== reportId));
                } else {
                    console.error(`Failed to delete the report with ID ${reportId}`);
                }
            } else {
                console.error(`Failed to delete the review with ID ${reviewId}`);
            }
        } catch (error) {
            console.error("Error deleting the review or report:", error);
        }
    };
    
    
    
    
    const handleReportRejection = async (reportId) => {
        try {
            const response = await fetch(`http://43.201.45.105:8080/api/v1/report/${reportId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                console.log(`Report with ID ${reportId} deleted successfully`);
                // 삭제 후 신고 목록에서 해당 신고 제거
                setReportList((prevList) => prevList.filter((report) => report.reportId !== reportId));
            } else {
                console.error("Failed to delete the report");
            }
        } catch (error) {
            console.error("Error deleting the report:", error);
        }
    };
    
    








    // 각 탭에 따라 적절한 콘텐츠를 렌더링하는 함수
    const renderContent = () => {
        switch (activeTab) {
            case "approval":
                return (
                    <div className={styles.content}>
                        {signUpList.length > 0 ? (
                            signUpList.map((item, index) => (
                                <div key={index} className={styles.approvalRow}>
                                    <div className={styles.approvalBox}>
                                        {/* 승인 대기 중인 점주 정보 출력 */}
                                        <p>회원 ID: {item.signUpId}</p>
                                        <p>이메일: {item.email}</p>
                                        <p>닉네임: {item.nickName}</p>
                                        <p>전화번호: {item.telNum}</p>
                                        <p>주소: {item.address}</p>
                                        <p>상세 주소: {item.detailAddress}</p>
                                        <p>가게 이름: {item.businessName}</p>
                                        <p>카테고리: {item.category}</p>
                                        <p>배달 가능 여부: {item.takeOut}</p>
                                    </div>
                                    <div className={styles.buttonGroup}>
                                        {/* 승인 및 거절 버튼 */}
                                        <button
                                            className={styles.approveButton}
                                            onClick={() => handleApprove(item)}
                                        >
                                            승인
                                        </button>
                                        <button
                                            className={styles.rejectButton}
                                            onClick={() => handleReject(item)}
                                        >
                                            거절
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>승인 요청을 기다리는 점주가 없습니다.</p>
                        )}
                    </div>
                );
                case "addClothing":
                    return (
                        <div className={styles.content}>
                            <form 
                                className={styles.form} 
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData();
                                    const clothesCreateDTO = {
                                        name: e.target.name.value,
                                        category: e.target.category.value,
                                        cost: 10000, // 하드코딩된 구매 비용
                                        limitLevel: e.target.limitLevel.value,
                                    };
                                    
                                    formData.append('clothesCreateDTO', new Blob([JSON.stringify(clothesCreateDTO)], { type: 'application/json' }));
                                    const image = e.target.image.files[0];
                                    if (image) {
                                        formData.append('image', image);
                                    }
                                    
                                    try {
                                        const response = await fetch('http://43.201.45.105:8080/api/v1/clothes', {
                                            method: 'POST',
                                            body: formData,
                                        });
                
                                        if (response.ok) {
                                            alert('의상이 성공적으로 추가되었습니다.');
                                        } else {
                                            alert('의상 추가에 실패했습니다.');
                                        }
                                    } catch (error) {
                                        console.error('의상 추가 중 오류 발생:', error);
                                        alert('의상 추가 중 오류가 발생했습니다.');
                                    }
                                }}
                            >
                                {/* 의상 추가 폼 */}
                                <div className={styles.inputGroup}>
                                    <label>의상 이름:  </label>
                                    <input type="text" name="name" required className={styles.textInput} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>분류:  </label>
                                    <select name="category" required className={styles.textInput}>
                                        <option value="HAT">HAT</option>
                                        <option value="SWEATER">SWEATER</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>제한 레벨:  </label>
                                    <input type="text" name="limitLevel" required className={styles.textInput} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>이미지:  </label>
                                    <input type="file" name="image" accept="image/*" className={styles.fileInput} />
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button type="submit" className={styles.submitButton}>
                                        등록
                                    </button>
                                    <button type="button" className={styles.cancelButton}>
                                        취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    );
                
                    case "report":
    return (
        <div className={styles.content}>
            {/* 신고 관리 화면 */}
            {reportList.length > 0 ? (
                reportList.map((report, index) => (
                    <div key={index} className={styles.approvalRow}>
                        <div className={styles.approvalBox}>
                            <h3>신고 정보</h3>
                            <p><strong>신고 ID:</strong> {report.reportId}</p>
                            <p><strong>카테고리:</strong> {report.category}</p>
                            <p><strong>제목:</strong> {report.title}</p>
                            <p><strong>설명:</strong> {report.description}</p>
                            <p><strong>작성일:</strong> {new Date(report.createdAt).toLocaleString()}</p>

                            <h4>리뷰 정보</h4>
                            <p><strong>리뷰 ID:</strong> {report.review.reviewId}</p>
                            <p><strong>평점:</strong> {report.review.rating}</p>
                            <p><strong>리뷰 제목:</strong> {report.review.title}</p>
                            <p><strong>리뷰 내용:</strong> {report.review.description}</p>
                            <p><strong>추천 수:</strong> {report.review.recommend}</p>
                            <p><strong>작성일:</strong> {new Date(report.review.createdAt).toLocaleString()}</p>

                            {/* 이미지 표시 */}
                            {report.review.image && (
                                <div>
                                    <strong>리뷰 이미지:</strong>
                                    <img
                                        src={`data:image/jpeg;base64,${report.review.image}`}
                                        alt="리뷰 이미지"
                                        className={styles.reviewImage}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.approveButton}
                                onClick={() => handleReportApproval(report.review.reviewId, report.reportId)}
                            >
                                리뷰삭제
                            </button>
                            <button
                                className={styles.rejectButton}
                                onClick={() => handleReportRejection(report.reportId)}
                            >
                                리뷰 그대로 두기
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>등록된 신고가 없습니다.</p>
            )}
        </div>
    );



                    
            default:
                return null;
        }
    };

    return (
        <div>
            <div className={styles.managerPage}>
                {/* 탭 네비게이션 */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "approval" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("approval")}
                    >
                        점주 맛집 등록 승인
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "addClothing" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("addClothing")}
                    >
                        의상추가
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "report" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("report")}
                    >
                        신고관리
                    </button>
                </div>
                {/* 현재 활성화된 탭에 맞는 콘텐츠 렌더링 */}
                {renderContent()}
            </div>
        </div>
    );
}

export default ManagerPage;
