import React from 'react';
import { Link } from 'react-router-dom';
import lightImage from '../../styles/images/error/505-light.png';
import darkImage from '../../styles/images/error/505.png';

const Error500 = () => {
  return (
    <div className="wrapper">
      <div className="container p-0">
        <div className="row no-gutters vh-100">
          <div className="col-sm-12 text-center align-self-center">
            <div className="iq-error position-relative mt-5">
              <img src={lightImage} className="img-fluid iq-error-img img-light center" alt="light image" />
              <img src={darkImage} className="img-fluid iq-error-img img-dark center" alt="dark image" />
              <h2 className="mb-0 text-center">Oops! This Page is Not Working.</h2>
              <p className="text-center">The requested is Internal Server Error.</p>
              <Link to="/" className="btn btn-primary mt-3">
                <span className="d-flex align-items-center">
                  <i className="material-symbols-outlined md-18 me-1">home</i>
                  Back to Home
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error500;
