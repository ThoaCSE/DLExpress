import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const FoodDetails = () => {
    const { id } = useParams();
    const [foodItem, setFoodItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/foods/${id}`);
                if (response.data) {
                    setFoodItem(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch product catalog details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
    };

    if (loading) {
        return (
            <div className="text-center my-5 py-5 w-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading product details...</p>
            </div>
        );
    }

    if (!foodItem) {
        return (
            <div className="container mt-5 text-center py-5">
                <h3 className="text-danger">Product Not Found</h3>
                <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="container my-5 py-3">
            <div className="row align-items-center justify-content-center g-5">

                {/* 1. Left Layout Column: Image Container */}
                <div className="col-12 col-md-5 d-flex justify-content-center">
                    <div className="card border-0 shadow-sm overflow-hidden p-3 bg-white" style={{ borderRadius: "16px", maxWidth: "400px" }}>
                        <img
                            src={foodItem.image}
                            alt={foodItem.name}
                            onError={handleImageError}
                            className="img-fluid rounded"
                            style={{ maxHeight: "360px", objectFit: "contain", width: "100%" }}
                        />
                    </div>
                </div>

                {/* 2. Right Layout Column: Detailed Content */}
                <div className="col-12 col-md-6">
                    <div className="product-details-content">

                        {/* FIXED: Changed back to the original category style matching image_271a18.png */}
                        <div className="d-flex align-items-center gap-2 mb-3 fs-5">
                            <span className="text-secondary fw-semibold">Category:</span>
                            <span className="badge bg-warning text-dark px-3 py-1.5 rounded fw-bold">
                {foodItem.category || "General"}
              </span>
                        </div>

                        <h2 className="fw-bold text-dark mb-3 lh-sm" style={{ fontSize: "2rem" }}>
                            {foodItem.name}
                        </h2>

                        <p className="text-muted mb-4 d-flex align-items-center gap-2">
                            <span className="text-secondary fw-semibold">Available at:</span>
                            <span className="badge bg-light text-primary border border-primary px-3 py-1 rounded-pill">
                {foodItem.market || "Market 1"}
              </span>
                        </p>

                        <div className="d-flex align-items-center gap-3 mb-4">
              <span className="h2 mb-0 fw-extrabold text-success">
                €{(foodItem.price || 0).toFixed(2)}
              </span>
                            <div className="text-warning d-flex align-items-center fs-5">
                                <i className="bi bi-star-fill me-1"></i>
                                <i className="bi bi-star-fill me-1"></i>
                                <i className="bi bi-star-fill me-1"></i>
                                <i className="bi bi-star-fill me-1"></i>
                                <i className="bi bi-star-half me-2"></i>
                                <span className="text-muted small fs-6">(4.5)</span>
                            </div>
                        </div>

                        <hr className="my-4 text-muted" />

                        <h5 className="fw-bold text-secondary mb-2">Product Description</h5>
                        <p className="text-muted lh-base mb-4 fs-6" style={{ textAlign: "justify" }}>
                            {foodItem.description || "Fresh premium catalog item sourced dynamically for quality metrics assurance."}
                        </p>

                        {/* FIXED: Scaled down the action button structure to make it smaller and not flex-grow wide */}
                        <div className="d-flex align-items-center gap-3 pt-2">
                            <button
                                className="btn btn-primary px-4 py-2.5 rounded-pill fw-bold shadow hover-up transition-all d-flex align-items-center justify-content-center gap-2"
                                type="button"
                                style={{ width: "200px", backgroundColor: "#99D9F2", border: "none"}} // Explicit safe width limit for compact UI look
                            >
                                <i className="bi bi-cart-plus-fill"></i> Add To Cart
                            </button>

                            <button
                                className="btn btn-outline-secondary d-flex align-items-center justify-content-center rounded-circle"
                                type="button"
                                style={{ width: "42px", height: "42px", padding: "0" }}
                            >
                                <i className="bi bi-heart"></i>
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default FoodDetails;