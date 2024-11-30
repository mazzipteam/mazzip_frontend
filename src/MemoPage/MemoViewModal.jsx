import React, { useState, useEffect } from 'react';
import styles from './MemoViewModal.module.css';

const MemoViewModal = ({ isOpen, onClose, onSubmit, memo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (memo) {
      setTitle(memo.content);
      setDescription(memo.description);
    }
  }, [memo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(memo.id, title, description);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !memo) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.memoId}>{memo.id}</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className={styles.modalInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용"
              className={styles.modalTextarea}
            />
          </div>
          <button type="submit" className={styles.modalSubmitButton}>
            수정
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemoViewModal;