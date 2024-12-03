import React, { useState, useEffect } from 'react';
import styles from './MemoPage.module.css';
import MemoModal from './MemoModal';
import MemoViewModal from './MemoViewModal'

const MemoPage = () => {
  const [memos, setMemos] = useState([]);
  const API_BASE_URL = "http://localhost:8080";
    
  // 메모 목록 불러오기
  const fetchMemos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/memo/all/1`);
      const result = await response.json();
      console.log('서버 응답:', result.data);  // 데이터 구조 확인
      setMemos(result.data);
    } catch (error) {
      console.error('Error:', error);
      setMemos([]);
    }
  };

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
          "userId": 1,
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
          userId: 1,
          title: title,
          description: description
        })
      });
      if (!response.ok) throw new Error('Failed to update memo');
      fetchMemos(); // 목록 새로고침
    } catch (error) {
      console.error('Error updating memo:', error);
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

  useEffect(() => {
    fetchMemos();
  }, []);

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