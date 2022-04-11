import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Singup from './Pages/Singup/Singup';
import OTPVerify from './Pages/OTPVerify/OTPVerify';

function App() {
  return (
    //set reacat router to use the Login component
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/singup" element={<Singup />} />
          <Route path="/otp" element={<OTPVerify />} />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
