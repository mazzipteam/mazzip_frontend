import React, { useState } from 'react';
import styles from './MenuEditModal.module.css';

const MenuEditModal = ({ menu, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    menuId: menu?.menuId || '',
    foodCategoryId: menu?.foodCategory?.foodCategoryId || '',
    name: menu?.name || '',
    price: menu?.price || '',
    description: menu?.description || '',
    cheap: menu?.cheap === 'Y',
    main: menu?.main === 'Y',
    isReserve: menu?.isReserve === 'Y'
  });
  
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(menu?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formPayload = new FormData();
      const menuUpdateDTO = {
        ...formData,
        cheap: formData.cheap ? 'Y' : 'N',
        main: formData.main ? 'Y' : 'N',
        isReserve: formData.isReserve ? 'Y' : 'N'
      };

      formPayload.append('menuUpdateDTO', JSON.stringify(menuUpdateDTO));
      
      if (image) {
        formPayload.append('image', image);
      }

      const response = await fetch('http://localhost:8080/api/v1/menu', {
        method: 'PATCH',
        body: formPayload
      });

      const result = await response.json();
      
      if (result.code === 200) {
        onUpdate(result.data);
        onClose();
      } else {
        throw new Error(result.message || '메뉴 수정에 실패했습니다.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>메뉴 수정</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.menuForm}>
          <div className={styles.formGroup}>
            <label>메뉴명</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>가격</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label>이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {previewImage && (
              <img 
                src={previewImage.startsWith('data:') ? previewImage : `data:image/png;base64,${previewImage}`}
                alt="메뉴 미리보기" 
                className={styles.imagePreview}
              />
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="cheap"
                checked={formData.cheap}
                onChange={handleCheckboxChange}
              />
              가성비
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="main"
                checked={formData.main}
                onChange={handleCheckboxChange}
              />
              대표메뉴
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isReserve"
                checked={formData.isReserve}
                onChange={handleCheckboxChange}
              />
              예약가능
            </label>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelButton}
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className={styles.submitButton}
            >
              {loading ? '수정 중...' : '수정완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuEditModal;