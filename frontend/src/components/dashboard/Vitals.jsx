import React from 'react';
import './Vitals.css';

const Vitals = () => {
  const vitals = {
    heartRate: 80,
    bloodPressure: '120/80',
    sleep: 7.5, // in hours
  };

  return (
    <div className="vitals">
      <div className="vital-box heart">
        <span className="vital-title">Heart rate</span>
        <div className="vital-value">
          <strong>{vitals.heartRate}</strong> <span>bpm</span>
        </div>
        <div className="lifeline-image-container">
        <img
          src="/lifeline-drawing.png"
          alt="Lifeline drawing"
          className="ekg-image"
        />
      </div>
      </div>

      <div className="vital-box pressure">
        <span className="vital-title">Blood pressure</span>
        <div className="vital-value">
          <strong>{vitals.bloodPressure}</strong> <span>sys</span>
        </div>
      </div>

      <div className="vital-box sleep">
        <span className="vital-title">Sleep</span>
        <div className="vital-value">
          <strong>{vitals.sleep}</strong> <span>hours</span>
        </div>
      </div>
    </div>
  );
};

export default Vitals;
