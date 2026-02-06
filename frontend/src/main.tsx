import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

import ScrollToTop from './components/ScrollToTop.tsx'

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
