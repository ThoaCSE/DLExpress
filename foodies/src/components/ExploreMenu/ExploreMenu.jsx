import React, { useRef } from 'react';
import { categories } from "../../assets/assets.js";
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
    const menuRef = useRef(null);

    // Smooth scroll logic skipping roughly 6 items per click
    const scrollLeft = () => {
        if (menuRef.current) {
            menuRef.current.scrollBy({ left: -750, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (menuRef.current) {
            menuRef.current.scrollBy({ left: 750, behavior: 'smooth' });
        }
    };

    return (
        <div className="explore-menu container mt-4" id="explore-menu">

            {/* Menu Header Title and Navigation Controllers */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-4 mb-2">
                <div>
                    <h2 className="mb-0 fw-bold text-dark">Explore Our Menu</h2>
                    <p className="text-muted small mb-0 mt-1">Explore curated lists of dishes from top categories</p>
                </div>

                {/* Scroll Control Buttons */}
                <div className="d-flex gap-2">
                    <i className="bi bi-arrow-left-circle fs-3 text-secondary cursor-pointer" onClick={scrollLeft}></i>
                    <i className="bi bi-arrow-right-circle fs-3 text-secondary cursor-pointer" onClick={scrollRight}></i>
                </div>
            </div>

            {/* Categories Carousel Horizontal Row Layout */}
            <div
                className="d-flex justify-content-between gap-4 overflow-auto explore-menu-list py-3"
                ref={menuRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories && categories.map((item, index) => {
                    // Normalize string metrics for reliable conditional rendering
                    const currentCategoryName = item && item.category ? String(item.category) : "General";
                    const isCurrentActive = category === currentCategoryName;

                    return (
                        <div
                            key={index}
                            className="text-center explore-menu-list-item flex-shrink-0"
                            onClick={() => setCategory(prev => prev === currentCategoryName ? 'All' : currentCategoryName)}
                            style={{ width: "160px", cursor: "pointer" }}
                        >
                            <img
                                src={item.icon}
                                alt=""
                                // FIXED: Pure bootstrap class injection with no internal inline borders to guarantee precise CSS outline mapping
                                className={isCurrentActive ? 'rounded-circle active' : 'rounded-circle'}
                                style={{ height: "120px", width: "120px", objectFit: "cover" }}
                            />
                            <p className="mt-2 fw-bold text-secondary small lh-sm px-1" style={{ wordBreak: "break-word" }}>
                                {currentCategoryName}
                            </p>
                        </div>
                    );
                })}
            </div>

            <hr className="explore-menu-hr" />
        </div>
    );
};

export default ExploreMenu;