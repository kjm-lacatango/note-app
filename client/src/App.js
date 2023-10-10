import React from 'react'
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Main from './pages/Main'
import Login from './pages/Login'
import Register from './pages/Register'
import Base from './pages/Base'
import Axios from 'axios'

function App() {
  
  Axios.defaults.withCredentials = true
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Base />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
