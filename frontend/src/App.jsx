import React from "react";

import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
const App = () => {
  return(
    <div className="App">
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="*" element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App;