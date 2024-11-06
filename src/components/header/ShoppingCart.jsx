import React from 'react';

const ShoppingCart = () => {
  return (
    <li className="nav-item dropdown">
      <a href="#" className="dropdown-toggle d-flex align-items-center" id="mail-drop" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span className="material-symbols-outlined position-relative">shopping_bag
          <span className="bg-primary text-white shopping-badge">3</span>
        </span>
        <span className="mobile-text d-none ms-3">Shopping Cart</span>
      </a>
      <div className="sub-drop dropdown-menu header-notification" aria-labelledby="mail-drop">
        <div className="card shadow m-0">
          {/* Cart content */}
          <div className="card-header d-flex justify-content-between px-0 pb-4 mx-5 border-bottom">
            <div className="header-title">
              <h5 className="fw-semibold">Shopping Cart</h5>
            </div>
          </div>
          <div className="card-body p-0">
            {/* Cart items */}
            <div className="m-5 mt-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="font-size-14 fw-bolder">Subtotal:</h6>
                <span className="font-size-14 fw-semibold text-primary">100.000đ</span>
              </div>
              <button type="button" className="btn btn-primary fw-500 w-100">View All Products</button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ShoppingCart;
