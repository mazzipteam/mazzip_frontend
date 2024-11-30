import React, { useState } from "react";
import styles from "./ManagerPage.module.css";
import LoggedInNavBar from "../NavBar/LoggedInNavBar";
import NavBar from "../NavBar/NavBar";

function ManagerPage() {
    const [activeTab, setActiveTab] = useState("approval");

    const renderContent = () => {
        switch (activeTab) {
            case "approval":
                return (
                    <div className={styles.content}>
                        {Array(7)
                            .fill(0)
                            .map((_, index) => (
                                <div key={index} className={styles.approvalRow}>
                                    <div className={styles.approvalBox}></div>
                                    <div className={styles.buttonGroup}>
                                        <button className={styles.approveButton}>승인</button>
                                        <button className={styles.rejectButton}>거절</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                );
            case "addClothing":
                return (
                    <div className={styles.content}>
                        <form className={styles.form}>
                            <input type="file" accept="image/*" className={styles.fileInput} />
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
                        {Array(6)
                            .fill(0)
                            .map((_, index) => (
                                <div key={index} className={styles.approvalRow}>
                                    <div className={styles.approvalBox}></div>
                                    <button className={styles.approveButton}>승인</button>
                                </div>
                            ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className={styles.managerPage}>
            
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "approval" ? styles.activeTab : ""
                            }`}
                        onClick={() => setActiveTab("approval")}
                    >
                        점주 맛집 등록 승인
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "addClothing" ? styles.activeTab : ""
                            }`}
                        onClick={() => setActiveTab("addClothing")}
                    >
                        의상추가
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "report" ? styles.activeTab : ""
                            }`}
                        onClick={() => setActiveTab("report")}
                    >
                        신고관리
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

export default ManagerPage;
