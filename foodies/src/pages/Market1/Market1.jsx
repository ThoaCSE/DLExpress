import React, { useState } from 'react'; // FIXED: Thêm useState
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";

const Market1 = () => {
    // FIXED: Khai báo độc lập để bổ trợ cho bộ lọc của FoodDisplay không bị undefined
    const [category, setCategory] = useState("All");

    return (
        <div className="market1-page">
            {/* Ghim chặt market="Market 1" để lấy đúng đồ ăn mã "1234" */}
            <FoodDisplay category={category} market="Market 1" />
        </div>
    );
};

export default Market1;