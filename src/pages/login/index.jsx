import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/style.css';
import ImageSlider from '../../components/ImageSlider';
import Logo from '../../public/images/logo.png';
import LogoLight from '../../public/images/logo-light.png';
import { callLogin } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await callLogin(formData);
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      // Handle successful login (e.g., save token, redirect)
      navigate('/'); // Redirect to the main page after login
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="sm:flex">
      <div className="relative lg:w-[580px] md:w-96 w-full p-10 min-h-screen bg-white shadow-xl flex items-center pt-10 dark:bg-slate-900 z-10">
        <div className="w-full lg:max-w-sm mx-auto space-y-10">
          <a href="/.."> 
            <img src={Logo} className="w-28 absolute top-10 left-10 dark:hidden" alt="" />
            <img src={LogoLight} className="w-28 absolute top-10 left-10 hidden dark:!block" alt="" />
          </a>

          <div>
            <h2 className="text-2xl font-semibold mb-1.5">Sign in to your account</h2>
            <p className="text-sm text-gray-700 font-normal">Don't have an account? <Link to="/register" className="text-blue-700">Register here!</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 text-sm text-black font-medium dark:text-white">
            <div>
              <label htmlFor="username" className="">Username</label>
              <div className="mt-2.5">
                <input id="username" name="username" type="text" required
                  className="!w-full !rounded-lg !bg-transparent !shadow-sm !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                  onChange={handleChange} value={formData.username} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="">Password</label>
              <div className="mt-2.5">
                <input id="password" name="password" type="password" required
                  className="!w-full !rounded-lg !bg-transparent !shadow-sm !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                  onChange={handleChange} value={formData.password} />
              </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div>
              <button type="submit" className="button bg-primary text-white w-full">Sign In</button>
            </div>
          </form>
        </div>
      </div>

      <ImageSlider />
    </div>
  );
};

export default Login;