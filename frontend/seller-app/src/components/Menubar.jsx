import React from 'react'

const Menubar = ({ toggleSidebar, shopId, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button className="btn btn-primary shadow-none" id="sidebarToggle" onClick={toggleSidebar}>
          <i className="bi bi-list" />
        </button>

        <span className="ms-3 fw-bold text-dark">
          Seller: <span className="badge bg-danger text-uppercase ms-1">{shopId || 'Partner'}</span>
        </span>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0 align-items-lg-center">
            <li className="nav-item dropdown">
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-1" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Menubar
