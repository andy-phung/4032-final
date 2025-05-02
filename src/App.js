import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import data from "./data.json";

import Album from "./components/Album.js";

function App() {
  const selectedAlbum = useRef("");

  

  return (
    <div className="bg-black w-screen h-screen">
      <div className="w-screen h-screen flex justify-center items-center">
        <Album name={"Face The Sun (2022)"}/>
      </div>
    </div>
  );
}

export default App;
