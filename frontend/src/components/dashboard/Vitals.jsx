import React from 'react';
import { useTranslation } from 'react-i18next';
import './Vitals.css';

const Vitals = () => {
  const { t } = useTranslation();

  const vitals = {
    heartRate: 80,
    bloodPressure: '120/80',
    sleep: 7.5, // in hours
  };

  return (
    <div className="vitals">
      <div className="vital-box heart">
        <span className="vital-title">{t('HeartRate')}</span>
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
        <span className="vital-title">{t('BloodPressure')}</span>
        <div className="vital-value">
          <strong>{vitals.bloodPressure}</strong> <span>sys</span>
        </div>
      </div>

      <div className="vital-box sleep">
        <span className="vital-title">{t('Sleep')}</span>
        <div className="vital-value">
          <strong>{vitals.sleep}</strong> <span>{t('hours')}</span>
        </div>
      </div>
    </div>
  );
};

export default Vitals;
