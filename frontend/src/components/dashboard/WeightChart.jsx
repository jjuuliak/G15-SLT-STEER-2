import React from 'react';
import { useTranslation } from 'react-i18next';
import './Weight.css';

const WeightChart = () => {
  const { t } = useTranslation();

  return (
    <div className="weight" style={{ gridArea: 'weight' }}>
      <span className="weight-title">{t('Weight')}</span>
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