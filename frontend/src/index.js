import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import { ResponsePopupProvider } from './hooks/useResponsePopup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <ResponsePopupProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ResponsePopupProvider>
    </BrowserRouter>
  </React.StrictMode>
);
