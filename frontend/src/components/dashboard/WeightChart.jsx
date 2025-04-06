import React from 'react';
import './Weight.css';

const WeightChart = () => {


  return (
    <div className="weight" style={{ gridArea: 'weight' }}>
      <span className="weight-title">Weight</span>
      <div className="weight-image-container">
        <img
          src="/weight-chart-image.png"
          alt="Weight Chart"
          className="weight-image"
        />
      </div>
    </div>
  );
};

export default WeightChart;