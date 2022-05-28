
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Singup from './Pages/Singup/Singup';
import { useSelector } from 'react-redux'


function App() {
  const { isAuth } = useSelector(state => state.user)
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={isAuth ? <Home  /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuth?<Navigate to="/"/>:<Login />} />
          <Route path="/singup" element={isAuth ? <Navigate to="/" /> : <Singup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
