import React from 'react';
import './HomePage.css';
import { LoginOutlined, CheckCircleTwoTone } from '@ant-design/icons';

const HomePage = () => {
  const handleLogin = () => {
    // Navigate to the login page, update with your routing logic
    window.location.href = "/login"; 
  };

  return (
    <>
      <div style={{ position: 'relative', height: '78vh', overflow: 'hidden' }}>
        <img
          src="https://res.cloudinary.com/dlo7urgnj/image/upload/v1727681543/IMG_20240930_130136_znzqnu.png"
          alt="Cab"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Cover the entire area
        />
        {/* Overlay Text */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          zIndex: 1,
          width:"70%"
        }}>
          {/* Text Overlay Here */}
          <h2 style={{ margin: '0', fontSize: '2rem' }}>Book Your</h2>
          <h1 style={{ margin: '0', fontSize: '3rem', fontWeight:"bold" }}>Cab Here..!</h1>
        </div>

        <div style={{
          position: 'absolute',
          top: '92%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          zIndex: 1,
          width:"100%"
        }}>
          <div style={{display:"flex", justifyContent:"space-around"}}>
          <h4 style={{ margin: '0', fontSize: '1.1rem' }}><CheckCircleTwoTone twoToneColor="#52c41a" />Comfort</h4>
          <h4 style={{ margin: '0', fontSize: '1.1rem' }}><CheckCircleTwoTone twoToneColor="#52c41a" />Safety</h4>
          <h4 style={{ margin: '0', fontSize: '1.1rem' }}><CheckCircleTwoTone twoToneColor="#52c41a" />24/7 Support</h4>
          </div>
        </div>
      </div>
      
      <div className="content">
        <h1 style={{margin:"0 0 5px 0", fontWeight:"bold", fontSize:"2.3rem"}}>Travello</h1>
        <p style={{fontSize: '1.1 rem'}}>Your Comfort Matters!</p>
        <button className='login-btn' onClick={handleLogin}><LoginOutlined /> Go Ahead!</button>
      </div> 
    </>
  );
};

export default HomePage;
