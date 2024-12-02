import React, { useState } from 'react';
import styles from './MemoModal.module.css';

const MemoModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2>Make Memo</h2>
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
            메모작성
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemoModal;