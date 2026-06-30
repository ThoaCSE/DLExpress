import React from 'react';
import { Link } from 'react-router-dom';

const FoodItem = ({ item }) => {
    const { id, name, description, price, market, imageUrl } = item;

    // SAFE GUARD: Auto replace with a beautiful food placeholder if the database link is broken
    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
    };

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
            <div className="card h-100 shadow-sm" style={{ maxWidth: "320px" }}>

                {/* Dynamic Image Link Container */}
                <Link to={`/food/${id}`}>
                    <img
                        src={imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"}
                        className="card-img-top"
                        alt={name || "Product Catalog Item"}
                        onError={handleImageError} // FIXED: Listen to image load errors and hot-swap the source url
                        style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                    />
                </Link>

                {/* Card Body Information Content */}
                <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                        <h5 className="card-title fw-bold text-dark text-truncate">{name}</h5>
                        <p className="card-text text-muted small text-truncate-2" style={{ display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {description}
                        </p>

                        <Link
                            to={`/${(market || '').toLowerCase().replace(" ", "")}`}
                            className="badge bg-light text-primary mb-2 text-decoration-none"
                        >
                            {market || 'General'}
                        </Link>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center">
              <span className="h5 mb-0 fw-bold text-success">
                €{(price || 0).toFixed(2)}
              </span>
                            <div>
                                <i className="bi bi-star-fill text-warning"></i>
                                <i className="bi bi-star-fill text-warning"></i>
                                <i className="bi bi-star-fill text-warning"></i>
                                <i className="bi bi-star-fill text-warning"></i>
                                <i className="bi bi-star-half text-warning"></i>
                                <small className="text-muted"> (4.5)</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button Footer Component Layout */}
                <div className="card-footer d-flex justify-content-between bg-light border-top-0 py-3">
                    <Link
                        className="btn btn-primary btn-sm flex-grow-1 me-2"
                        to={`/food/${id}`}
                        style={{ backgroundColor: "#99D9F2", border: "none" }}
                    >
                        View Food
                    </Link>
                    <button className="btn btn-outline-secondary btn-sm" type="button">
                        <i className="bi bi-heart"></i>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FoodItem;