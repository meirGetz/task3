import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// וודא ש-ReactDOM מייבא כראוי ושה-ID הוא 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
