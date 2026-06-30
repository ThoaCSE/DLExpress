import React from 'react';
// IMPORT MECHANISM: Fetch the real 23 categories array dynamically from central assets
import { categories } from '../../assets/assets.js';
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";// Ensure matching import path to your directory

const ExploreFood = ({ category = "All", setCategory, setSearchQuery }) => {

    // Handle select dropdown change event safely
    const handleCategoryChange = (e) => {
        if (setCategory) {
            setCategory(e.target.value);
        }
    };

    // Handle standard search input text tracking field
    const handleSearchChange = (e) => {
        if (setSearchQuery) {
            setSearchQuery(e.target.value);
        }
    };

    return (
        <div className="container my-4" id="explore-food-search">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="input-group mb-3 shadow-sm rounded">

                            {/* Dynamic Select Dropdown: Automated listing using array mapping instead of hardcoded options */}
                            <select
                                className="form-select fw-semibold text-secondary"
                                value={category}
                                onChange={handleCategoryChange}
                                style={{ maxWidth: '160px', cursor: 'pointer' }}
                            >
                                <option value="All">All Categories</option>
                                {categories && categories.map((item, index) => {
                                    const name = item && item.category ? String(item.category) : "General";
                                    return (
                                        <option key={index} value={name}>
                                            {name}
                                        </option>
                                    );
                                })}
                            </select>

                            {/* Text Search Field Input Component Layout */}
                            <input
                                type="text"
                                className="form-control py-2 px-3"
                                placeholder="Search your favorite dish..."
                                onChange={handleSearchChange}
                            />

                            {/* FIXED: Standardized button layout utilizing the requested blue color configuration */}
                            <button
                                className="btn text-white px-3"
                                type="submit"
                                style={{ backgroundColor: "#4A90E2", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                            >
                                <i className="bi bi-search"></i>
                            </button>

                        </div>
                    </form>
                </div>
            </div>

            {/* DÒNG 31 CỦA THẦY: Render the dynamic synchronized food cards component directly below */}
            <FoodDisplay category={category} />

        </div>
    );
};

export default ExploreFood;