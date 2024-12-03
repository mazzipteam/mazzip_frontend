import React, { useState, useEffect } from 'react';
import styles from './MemoViewModal.module.css';

const MemoViewModal = ({ isOpen, onClose, onSubmit, memo, onDelete = () => {} }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  useEffect(() => {
    if (memo) {
      setTitle(memo.title || '');
      setDescription(memo.description || '');
    }
  }, [memo, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(memo.memoId, title, description);
    onClose();
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDelete = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      onDelete(memo.memoId);
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !memo) return null;

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="제목"
              className={styles.modalInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="내용"
              className={styles.modalTextarea}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.modalSubmitButton}>수정</button>
            <button 
              type="button" 
              onClick={handleDelete} 
              className={styles.modalDeleteButton}
            >
              삭제
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoViewModal;