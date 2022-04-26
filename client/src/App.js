//get public accuss image

import React ,{useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Singup from './Pages/Singup/Singup';


import { useSelector, useDispatch } from 'react-redux'
import { fetchUser } from './Features/User'

function App() {
    const Auth = useSelector(state => state.user.userInfo.isAuth)
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(fetchUser())
    },[dispatch])
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={Auth ? <Home /> : <Navigate to="/singup" />} />
          <Route path="/login" element={Auth?<Navigate to="/"/>:<Login />} />
          <Route path="/singup" element={Auth?<Navigate to="/"/>:<Singup />} />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
