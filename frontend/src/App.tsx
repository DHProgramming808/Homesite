import React from "react";
import { useEffect, useState } from "react";
import { getInfo } from "./api";
import './App.css'

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Stub from "./pages/Stub";
import { isAuthenticated } from "./auth";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Home from "./pages/Home";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Home />}/>
        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />} />

        <Route
          path = "/stub"
          element = {
            <ProtectedRoute>
              <Stub />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}


function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to = "/login" />;
}


function GetInfo() {
  const [info, setInfo] = useState<{ name?: string; framework?: string; version?: string } | null>(null);

  useEffect(() => {
    getInfo().then(data => setInfo(data));
  }, []);

  if (!info) return <div>Loading...</div>

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{info.name}</h1>
      <p>Framework: {info.framework}</p>
      <p>Version: {info.version}</p>
    </div>
  )

}


