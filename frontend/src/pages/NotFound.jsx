import React from "react";
import { Button } from '@mui/material';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const user = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();
    const { t } = useTranslation();

  function handleClick() {
    user ? navigate('/') : navigate('/login');
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.text}>{t('404page')}</p>
      <Button variant='contained' onClick={handleClick}>{t('back')}</Button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "10%",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "6rem",
    fontWeight: "bold",
  },
  text: {
    fontSize: "1.5rem",
    color: "#333",
  },
};
