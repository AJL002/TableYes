import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import router from './router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <router />
    </React.StrictMode>,
  );