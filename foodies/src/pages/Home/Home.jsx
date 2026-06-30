import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const Home = () => {
    // Khai báo state lưu danh mục đang chọn
    const [category, setCategory] = useState("All");

    return (
        <div className="home-page-layout">
            <main className='container'>
                <Header />
                <ExploreMenu category={category} setCategory={setCategory} />

                {/* GIỮ NGUYÊN BẢN GỐC: Không truyền market để trang Home hiện TẤT CẢ các món ăn */}
                <FoodDisplay category={category} />
            </main>
        </div>
    );
};

export default Home;