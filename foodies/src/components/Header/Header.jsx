import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="p-5 mb-4 bg-light rounded-3 mt-1">
            <div className="container-fluid py-5">
                <h1 className='display-5 fw-bold'>Oder your food here</h1>
                <p className='col-md-8 fs-4'>Discover the BEST Food & Drinks in Frankfurt</p>
                <Link to="/explore" className='btn btn-primary'style={{ backgroundColor: "#99D9F2", border: "none" }}>Explore</Link>

            </div>
        </div>
    )
}

export default Header;