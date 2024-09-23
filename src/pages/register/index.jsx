import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/style.css';
import ImageSlider from '../../components/ImageSlider';
import logo from '../../public/images/logo.png';
import logoLight from '../../public/images/logo-light.png';
import { callRegister } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    retype_password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
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
      navigate('/login'); // Redirect to login page after showing success message
    }, 2000); // 2 seconds delay for success message
  } catch (error) {
    setError(error.response?.data?.message || 'An error occurred during registration');
    setLoading(false);
  }
  };
  
  return (
    <div className="sm:flex">
      <div className="relative lg:w-[580px] md:w-96 w-full p-10 min-h-screen bg-white shadow-xl flex items-center pt-10 dark:bg-slate-900 z-10">
        <div className="w-full lg:max-w-sm mx-auto space-y-10">
          <a href="#">
            <img src={logo} className="w-28 absolute top-10 left-10 dark:hidden" alt="" />
            <img src={logoLight} className="w-28 absolute top-10 left-10 hidden dark:!block" alt="" />
          </a>
  
          <div>
            <h2 className="text-2xl font-semibold mb-1.5"> Sign up to get started </h2>
            <p className="text-sm text-gray-700 font-normal">If you already have an account, <Link to="/login" className="text-blue-700">Login here!</Link></p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-7 text-sm text-black font-medium dark:text-white">
            <div className="grid grid-cols-2 gap-4 gap-y-7">
              <div>
                <label htmlFor="first_name" className="">First name</label>
                <div className="mt-2.5">
                  <input id="first_name" name="first_name" type="text" required
                    className="!w-full !rounded-lg !bg-transparent !shadow-sm !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                    onChange={handleChange} value={formData.first_name} />
                </div>
              </div>
  
              <div>
                <label htmlFor="last_name" className="">Last name</label>
                <div className="mt-2.5">
                  <input id="last_name" name="last_name" type="text" required
                    className="!w-full !rounded-lg !bg-transparent !shadow-sm !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                    onChange={handleChange} value={formData.last_name} />
                </div>
              </div>
  
              <div className="col-span-2">
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
  
              <div>
                <label htmlFor="retype_password" className="">Confirm Password</label>
                <div className="mt-2.5">
                  <input id="retype_password" name="retype_password" type="password" required
                    className="!w-full !rounded-lg !bg-transparent !shadow-sm !border-slate-200 dark:!border-slate-800 dark:!bg-white/5"
                    onChange={handleChange} value={formData.retype_password} />
                </div>
              </div>
  
              {error && <div className="col-span-2 text-red-500">{error}</div>}
              {success && <div className="col-span-2 text-green-500">{success}</div>}
  
              <div className="col-span-2">
                <button type="submit" className="button bg-primary text-white w-full" disabled={loading}>
                  {loading ? 'Loading...' : 'Get Started'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
      <ImageSlider />
    </div>
  );
};

export default Register;