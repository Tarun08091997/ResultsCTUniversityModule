// src/MaintenancePage.jsx

import React from 'react';

const MaintenancePage = () => {
  const containerStyle = {
    display: 'flex',
    
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  };

  const paragraphStyle = {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  };

  return (
    <div style={containerStyle}>
       <div style={{textAlign:'center'}}>
          <h1 style={headingStyle}>We'll be back soon!</h1>
          <p style={paragraphStyle}>
            Sorry for the inconvenience but we’re performing some maintenance at the moment. We’ll be back online shortly!
          </p>
          <p style={paragraphStyle}>&mdash; The Team</p>
       </div>
    </div>
  );
};

export default MaintenancePage;
