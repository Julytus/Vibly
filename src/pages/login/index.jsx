import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SliderSign from '../slidersign';
import { callLogin } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../../services/api';
import { doLoginAction } from '../../redux/account/accountSlice';
const Login = () => {
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await callLogin(formData);
      localStorage.setItem('token', response.data.token);
      const profile = await fetchProfile();
      dispatch(doLoginAction(profile));
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="wrapper">
      <section className="sign-in-page">
        <div className="container-fluid">
          <div className="row align-items-center">
            <SliderSign />
            <div className="col-md-6">
              <div className="sign-in-from text-center">
                <Link to="/" className="d-inline-flex align-items-center justify-content-center gap-2">
                  <svg width="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG path ở đây */}
                  </svg>
                  <h2 className="logo-title" data-setting="app_name" style={{ fontSize: '40px', fontWeight: 'bold' }}>Vibly</h2>
                </Link>
                <p className="mt-3 font-size-16">Welcome to Vibly, a platform to connect with<br /> the social world</p>
                <form className="mt-5" onSubmit={handleSubmit}>
                  <div className="form-group text-start">
                    <h6 className="form-label fw-bold">Username or Email Address</h6>
                    <input 
                      type="text" 
                      className="form-control mb-0" 
                      placeholder="Your Username or Email Address"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group text-start">
                    <h6 className="form-label fw-bold">Your Password</h6>
                    <input 
                      type="password" 
                      className="form-control mb-0" 
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  {error && <div className="text-red-500" style={{ fontSize: '14px', color: 'red' }}>{error}</div>}
                  <button type="submit" className="btn btn-primary mt-4 fw-semibold text-uppercase w-100">
                    Sign In
                  </button>
                  <h6 className="mt-5">
                    Don't Have An Account? <Link to="/register">Sign Up</Link>
                  </h6>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
