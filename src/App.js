import './App.css';
import React from 'react';
import { Routes, Route} from "react-router-dom";
import About from "./routes/about";
import Home from "./routes/home";
import Navbar from './navbar';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
export default App;