import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from './redux/reducers/rootReducer';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div
          style={{
            '--primary-main': theme.palette.primary.main,
            '--primary-secondary': theme.palette.primary.secondary,
            '--primary-light': theme.palette.primary.light,
          }}
        >
          <App />
        </div>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
