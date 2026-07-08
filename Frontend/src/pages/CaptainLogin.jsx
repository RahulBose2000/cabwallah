import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainLogin = () => {
  const email = useRef(null);
  const password = useRef(null);
  
  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();

  const SubmitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      email: email.current.value,
      password: password.current.value
    };

    console.log(captainData);
    
    try {
      // Send login request to the API
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData);

      if (response.status === 200) {
        const data = response.data;

        // Save captain data and token
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);

        // Navigate to captain home page
        navigate('/captain-home');
      }

      // Clear the inputs regardless of login success
      email.current.value = '';
      password.current.value = '';
    } catch (error) {
      // Handle error (wrong email/password)
      console.error('Login failed:', error);
      
      // Clear the inputs in case of failure (optional)
      email.current.value = '';
      password.current.value = '';
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between bg-[#000000] text-white">
      <div>
        <img
          className="w-16 mb-10"
          src="https://imgs.search.brave.com/iUu_pSUB4XC14yY3lkGujRPUI3q11j4kizg-ipgasO8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY1OTc2ODc3/OXViZXItbG9nby13/aGl0ZS5wbmc"
          alt="Uber Logo"
        />
        <form onSubmit={SubmitHandler}>
          <h3 className="text-lg font-medium mb-2">What's Your Email</h3>
          <input
            className="bg-[#333333] text-white mb-7 rounded px-4 py-2 border w-full placeholder:text-base"
            required
            placeholder="email@example.com"
            type="email"
            ref={email}
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#333333] text-white mb-7 rounded px-4 py-2 border w-full placeholder:text-base"
            required
            placeholder="password"
            type="password"
            ref={password}
          />
          <button className="bg-[#333333] text-white font-semibold mb-3 rounded px-6 py-3 border border-[#555555] w-full text-lg transition-all duration-300 ease-in-out transform hover:bg-[#555555] hover:border-[#777777]">
            Login
          </button>
        </form>
        <p className="text-center">
          Join a fleet?{' '}
          <Link to="/captain-signup" className="text-blue-600">
            Register as a Captain
          </Link>
        </p>
      </div>
      <div>
        <Link to='/login' className="bg-[#333333] font-semibold flex justify-center items-center text-white mb-7 rounded px-4 py-2 border w-full text-lg">
          Sign in as User
        </Link>
      </div>
    </div>
  );
}

export default CaptainLogin;
