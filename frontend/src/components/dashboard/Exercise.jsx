import React from 'react';
import { useTranslation } from 'react-i18next';
import './Exercise.css';

const Exercise = () => {
  const { t } = useTranslation();

  return (
    <div className="exercise">
      <span className="exercise-title">{t('workout-plan')}</span>

    </div>
  );
};

export default Exercise;