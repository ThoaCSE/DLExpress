import React, { useState } from 'react'; // FIXED: Thêm useState
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";

const Market2 = () => {
    // FIXED: Khai báo độc lập để bổ trợ cho bộ lọc của FoodDisplay không bị undefined
    const [category, setCategory] = useState("All");

    return (
        <div className="market2-page">
            {/* Ghim chặt market="Market 2" để lấy đúng đồ ăn mã "5678" */}
            <FoodDisplay category={category} market="Market 2" />
        </div>
    );
};

export default Market2;