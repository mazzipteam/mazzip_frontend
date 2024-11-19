import React from 'react';
import styles from './WishListPage.module.css';

function WishListPage() {
    const wishListItems = [
        { name: '도미노피자', rating: 3.5, logo: 'dominos.png' },
        { name: '스쿨푸드', rating: 3.5, logo: 'schoolfood.png' },
        { name: 'BBQ', rating: 3.5, logo: 'bbq.png' },
        { name: '메가커피', rating: 3.5, logo: 'megacoffee.png' },
    ];

    return (
        <div className={styles.wishlistPage}>
            <h2 className={styles.wishlistTitle}>찜 목록</h2>
            <div className={styles.wishlistItems}>
                {wishListItems.map((item, index) => (
                    <div className={styles.wishlistItem} key={index}>
                        <img src={`images/${item.logo}`} alt={item.name} className={styles.itemLogo} />
                        <div className={styles.itemInfo}>
                            <p className={styles.itemName}>{item.name}</p>
                            <p className={styles.itemRating}>⭐ {item.rating}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WishListPage;
