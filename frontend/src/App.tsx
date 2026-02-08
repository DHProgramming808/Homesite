import React from "react";
import { useEffect, useState } from "react";
import { getInfo } from "./api";
import './App.css'

import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Stub from "./pages/Stub";
import AdminStub from "./pages/AdminStub";

import Home from "./pages/Home";

import AboutMe from "./pages/AboutMe";
import TechnicalMe from "./pages/TechnicalMe";
import Contact from "./pages/Contact";

import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Projects from "./pages/Projects";
// TODO add more pages and routes as needed, and add some nice styling to the whole app

import RecipesHome from "./pages/recipes/RecipesHome";
import RecipePage from "./pages/recipes/RecipePage";
import RecipesEditor from "./pages/recipes/RecipeEditor";
import RecipesEditorLogin from "./pages/recipes/RecipeEditorLogin";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";



export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Home />}/>
        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />} />

        <Route path = "/aboutme" element = {<AboutMe />} />
        <Route path = "/technicalme" element = {<TechnicalMe />} />
        <Route path = "/contact" element = {<Contact />} />

        <Route path = "/projects" element = {<Projects />} />

        <Route path = "/recipes" element = {<RecipesHome />} />
        <Route path = "/recipes/:id" element = {<RecipePage />} />
        <Route path = "/recipes/edit-login" element = {<RecipesEditorLogin />} />
        <Route path = "/recipes/edit"
          element = {
            <ProtectedRoute>
              <RecipesEditor />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path = "/stub"
          element = {
            <ProtectedRoute>
              <Stub />
            </ProtectedRoute>
          }
        />

        <Route
          path = "/adminstub"
          element = {
            <AdminRoute>
              <AdminStub />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

// TODO remove
//function ProtectedRoute({ children }: { children: React.JSX.Element }) {
//  return isAuthenticated() ? children : <Navigate to = "/login" />;
//}


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


