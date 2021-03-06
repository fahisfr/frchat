
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Singup from './Pages/Singup/Singup';
import { useSelector } from 'react-redux'



function App() {
  const isAuth = useSelector(state => state.user.isAuth)
  const token = localStorage.getItem("auth_token")

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={ token? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
          <Route path="/singup" element={token ? <Navigate to="/" /> : <Singup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
