import React, { useState, useEffect } from 'react';
import styles from './MemoPage.module.css';
import MemoModal from './MemoModal';
import MemoViewModal from './MemoViewModal'

const MemoPage = () => {
  const [memos, setMemos] = useState([]);
  const API_BASE_URL = "http://localhost:8080";
  const userId = localStorage.getItem('userId');

  const fetchMemos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/memo/all/${userId}`);
      const result = await response.json();
      setMemos(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('메모 로딩 실패:', error);
      setMemos([]);
    }
  };


  useEffect(() => {  
    console.log('Current userId:', userId);
    if (userId) {
      fetchMemos();
    }
  }, [userId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);

  // 메모 생성
  const handleCreateMemo = async (title, description) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/memo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "restaurantId": 1,
          "userId": userId,  // 변경
          "title": title,
          "description": description
        })
      });
      if (!response.ok) throw new Error('Failed to create memo');
      fetchMemos(); // 목록 새로고침
    } catch (error) {
      console.error('Error creating memo:', error);
    }
  };

  // 메모 수정
  const handleUpdateMemo = async (id, title, description) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/memo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: title,
          description: description
        })
      });
      const newMemo = await response.json();
            setMemos([...memos, newMemo]);
        } catch (error) {
            console.error('메모 생성 실패:', error);
        }
    };

  // 메모 삭제
  const handleDeleteMemo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/memo/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete memo');
      fetchMemos(); // 목록 새로고침
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  };


  const handleMemoClick = (memo) => {
    setSelectedMemo(memo);
    setIsViewModalOpen(true);
  };

  return (
    <div className={styles.memoContainer}>
      <h1>Memo</h1>
      <div className={styles.memoList}>
      {memos.map((memo) => (
    <div 
    key={memo.memoId}  // memoId를 key로 사용
    className={styles.memoItem}
    onClick={() => handleMemoClick(memo)}>
    <span className={styles.memoNumber}>{memo.memoId}</span>
    <span className={styles.memoContent}>{memo.title}</span>
  </div>
))}
      </div>
      <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
        메모작성
      </button>

      <MemoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMemo}
      />

      <MemoViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onSubmit={handleUpdateMemo}
        onDelete={handleDeleteMemo}
        memo={selectedMemo}
      />
    </div>
  );
};

export default MemoPage;