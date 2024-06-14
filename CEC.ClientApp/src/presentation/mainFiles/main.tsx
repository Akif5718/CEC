// import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './main.css';
import { store } from '../../application/Redux/store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> //ei react strict mode by default project declaration er time e silo, br3 index.js e dhuika dekhis, nai!
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);
