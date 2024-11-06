import React from 'react';
import { Link } from 'react-router-dom';

const BlogStore = () => {
  return (
    <div className="d-flex align-items-center justify-content-between product-offcanvas">
      <div className="offcanvas offcanvas-end shadow-none iq-product-menu-responsive d-none d-xl-block on-rtl end" tabIndex="-1" id="offcanvasBottomNav">
        <div className="offcanvas-body">
          <ul className="iq-nav-menu list-unstyled">
            <li className="nav-item">
              <Link className="nav-link menu-arrow justify-content-start active" to="/">
                <span className="nav-text">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-arrow justify-content-start" data-bs-toggle="collapse" to="#blogData" role="button" aria-expanded="false" aria-controls="blogData">
                <span className="nav-text">Blog</span>
              </Link>
              <ul className="iq-header-sub-menu list-unstyled collapse shadow" id="blogData">
                <li className="nav-item">
                  <Link className="nav-link" to="/blog/grid">Blog Grid</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/blog/list">Blog List</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/blog/detail">Blog Detail</Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-arrow justify-content-start" data-bs-toggle="collapse" to="#storeData" role="button" aria-expanded="false" aria-controls="storeData">
                <span className="nav-text">Store</span>
              </Link>
              <ul className="iq-header-sub-menu list-unstyled collapse shadow" id="storeData">
                <li className="nav-item">
                  <Link className="nav-link" to="/store/category-grid">Category Grid</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/store/category-list">Category List</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/store/detail">Store Detail</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/store/product-detail">Product Detail</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/store/checkout">Checkout</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogStore;
