import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category = "All", market = "All" }) => {
    const { foodList } = useContext(StoreContext);

    // FIXED: Strict filtering that allows ALL products to display on the Home page
    const filteredFoods = Array.isArray(foodList)
        ? foodList.filter((item) => {
            if (!item) return false;

            // 1. Kiểm tra Danh mục (Giữ nguyên logic gốc của em bé)
            const matchesCategory = category === "All" || item.category === category;

            // 2. FIXED LOGIC CHỢ: Nếu market là "All" (Trang Home) -> Cho qua luôn.
            // Nếu là "Market 1" -> Lọc mã "1234". Nếu là "Market 2" -> Lọc mã "5678".
            let matchesMarket = true;
            if (market === "Market 1") {
                matchesMarket = String(item.storeId) === "1234";
            } else if (market === "Market 2") {
                matchesMarket = String(item.storeId) === "5678";
            }

            return matchesCategory && matchesMarket;
        })
        : [];

    return (
        <div className="container mt-4" id="food-display">
            <h2 className="mb-4 fw-bold text-dark">Top dishes near you</h2>
            <div className="row">
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((item) => (
                        <FoodItem
                            key={item._id?.$oid || item._id || Math.random().toString()}
                            item={item}
                        />
                    ))
                ) : (
                    /* Loading State Overlay - GIỮ NGUYÊN CỦA EM BÉ */
                    <div className="text-center my-5 py-5 w-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Fetching dynamic products from database...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodDisplay;