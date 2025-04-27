import React from 'react';
import { useTranslation } from 'react-i18next';
import './HamsterFamily.css';

const HamsterFamily = () => {
  const { t } = useTranslation();

  return (
    <div className="family">
      <span className="family-title">{t('Family')}</span>
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