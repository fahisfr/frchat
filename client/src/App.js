import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from './Pages/Login/Login';
import Singup from './Pages/Singup/Singup';

function App() {
  return (
    //set reacat router to use the Login component
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/singup" element={<Singup />} />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
