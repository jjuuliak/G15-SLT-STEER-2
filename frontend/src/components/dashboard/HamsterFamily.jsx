import React from 'react';
import './HamsterFamily.css';

const HamsterFamily = () => {


  return (
    <div className="family">
      <span className="family-title">Visit your hamster family</span>
      <div className="hamster-family-image-container">
        <img
          src="/hamster-family.png"
          alt="Hamster family"
          className="family-image"
        />
      </div>
    </div>
  );
};

export default HamsterFamily;