import React from "react";
import Dashboard from "./pages/Dashboard.jsx";
import { Toaster } from "react-hot-toast";
const App = () => {
  return(
    <div className="App">
      <Toaster position="top-center"/>
      <Dashboard/>
    </div>
  )
}

export default App;