import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot desde react-dom
import App from './App';
import "bulma/css/bulma.css";
import axios from "axios";

axios.defaults.withCredentials = true;

// Utiliza createRoot en lugar de ReactDOM.render
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
