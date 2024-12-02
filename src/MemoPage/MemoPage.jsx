import React, { useState } from 'react';
import styles from './MemoPage.module.css';
import MemoModal from './MemoModal';
import MemoViewModal from './MemoViewModal'

const MemoPage = () => {
  const [memos, setMemos] = useState([
    { 
      id: 1,
      content: '메모 제목',
      description: '메모 내용~~'
    },
    { 
      id: 2,
      content: '메모 제목',
      description: '메모 내용~~'
    },
    { 
      id: 3,
      content: '메모 제목',
      description: '메모 내용~~'
    },
    { 
      id: 4,
      content: '메모 제목',
      description: '메모 내용~~'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);

  const handleCreateMemo = (title, description) => {
    const newMemo = {
      id: memos.length + 1,
      content: title,
      description: description
    };
    setMemos([...memos, newMemo]);
  };

  const handleUpdateMemo = (id, title, description) => {
    setMemos(memos.map(memo => 
      memo.id === id ? { ...memo, content: title, description: description } : memo
    ));
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
          key={memo.id} 
          className={styles.memoItem}
          onClick={() => handleMemoClick(memo)}>
            <span className={styles.memoNumber}>{memo.id}</span>
            <span className={styles.memoContent}>{memo.content}</span>
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
        memo={selectedMemo}
      />
    </div>
  );
};

export default MemoPage;