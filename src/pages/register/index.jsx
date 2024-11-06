import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SliderSign from '../slidersign';
import { callRegister } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    retype_password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.retype_password) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await callRegister(formData);
      console.log(response.data);
      setSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during registration');
      setLoading(false);
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
                  <h2 className="logo-title" style={{ fontSize: '40px', fontWeight: 'bold' }}>Vibly</h2>
                </Link>
                <p className="mt-3 font-size-16">Welcome to Vibly, a platform to connect with<br /> the social world</p>
                <form className="mt-5" onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="form-group text-start">
                        <h6 className="form-label fw-bold">First Name</h6>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="First Name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group text-start">
                        <h6 className="form-label fw-bold">Last Name</h6>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Last Name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group text-start mb-3">
                    <h6 className="form-label fw-bold">Username</h6>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group text-start mb-3">
                    <h6 className="form-label fw-bold">Email Address</h6>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Your Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="form-group text-start">
                        <h6 className="form-label fw-bold">Password</h6>
                        <input 
                          type="password" 
                          className="form-control" 
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group text-start">
                        <h6 className="form-label fw-bold">Confirm Password</h6>
                        <input 
                          type="password" 
                          className="form-control" 
                          placeholder="Confirm Password"
                          name="retype_password"
                          value={formData.retype_password}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    {error && <div className="col-span-2 text-red-500" style={{ fontSize: '14px', color: 'red' }}>{error}</div>}
                    {success && <div className="col-span-2 text-green-500" style={{ fontSize: '14px', color: 'green' }}>{success}</div>}
                  </div>
                  <button type="submit" className="btn btn-primary mt-4 fw-semibold text-uppercase w-100" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign up'}
                  </button>
                  <h6 className="mt-5">
                    Already Have An Account ? <Link to="/login">Login</Link>
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

export default Register;
