import React, { useState, useEffect } from 'react';
import styles from './MenuManagementPage.module.css';
import MenuEditModal from './MenuEditModal';

const MenuManagementPage = ({ restaurantId }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (restaurantId) {
        fetchMenus();
    }
  }, [restaurantId]);

  const fetchMenus = async () => {
    try {
      const response = await fetch(`http://43.201.45.105:8080/api/v1/menu/all/${restaurantId}`);
      if (!response.ok) {
        throw new Error('메뉴 데이터를 가져오는데 실패했습니다.');
      }
      const result = await response.json();
      if (result.code === 200) {
        setMenus(result.data);
      } else {
        throw new Error(result.message || '메뉴 데이터 로딩 실패');
      }
    } catch (error) {
      setError(error.message);
      console.error('메뉴 로딩 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedMenu(null);
    };

    const handleMenuUpdate = (updatedMenu) => {
        setMenus(prevMenus => 
            prevMenus.map(menu => 
                menu.menuId === updatedMenu.menuId ? updatedMenu : menu
            )
        );
    };

  if (loading) {
    return <div className="loading">메뉴 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={styles.menuManagement}>
        <h2 className={styles.menuManagementTitle}>메뉴 관리</h2>
        <div className={styles.menuGrid}>
            {menus.map((menu) => (
                <div 
                    key={menu.menuId} 
                    className={styles.menuCard}
                    onClick={() => handleMenuClick(menu)}
                    role="button"
                    tabIndex={0}
                >
                <img
                    src={`data:image/png;base64,${menu.image}`}
                    alt={menu.name}
                    className={styles.menuImage}
                    onError={(e) => {
                        e.target.src = '/default-menu-image.jpg';
                        e.target.onerror = null;
                     }}
                />
                <div className={styles.menuInfo}>
                    <h3 className={styles.menuName}>{menu.name}</h3>
                    <p className={styles.menuPrice}>
                        {menu.price.toLocaleString()}원
                    </p>                        <p className={styles.menuDescription}>
                        {menu.description}
                    </p>
                    <div className={styles.menuTags}>
                        {menu.main === 'Y' && (
                        <span className={`${styles.tag} ${styles.mainTag}`}>
                        대표메뉴                                
                        </span>
                        )}
                        {menu.isReserve === 'Y' && (
                         <span className={`${styles.tag} ${styles.reserveTag}`}>
                        예약가능
                         </span>
                            )}
                        {menu.cheap === 'Y' && (
                        <span className={`${styles.tag} ${styles.cheapTag}`}>
                        가성비
                        </span>
                        )}
                    </div>
                </div>
            </div>
            ))}
        </div>

        {selectedMenu && (
            <MenuEditModal
                menu={selectedMenu}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onUpdate={handleMenuUpdate}
            />
        )}
    </div>
);
};

export default MenuManagementPage;