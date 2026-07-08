import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div
    className="bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1579283980477-b6347f428a98?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] pt-8 h-screen flex flex-col justify-between w-full"
  >
      {/* Image Section */}
     
      <img 
        className="w-16 ml-8" 
       src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' 
        alt="Cabwallah Logo" 
      />
      

      {/* Content Section */}
      <div className="bg-white py-4 px-4 pb-7">
        <h2 className="text-3xl font-bold text-gray-800 ">Get Started With Cabwallah</h2>
        <Link to='/login' className=" flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
