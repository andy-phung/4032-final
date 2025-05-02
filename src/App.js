import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import data from "./data.json";

import Album from "./components/Album.js";

function App() {
  const selectedAlbum = useRef("");

  let albums = [];

  for (const album_name in data) {
    albums.push(<Album name={`${album_name} (${data[album_name]["release_year"]})`}/>)
  }

  return (
    <div className="bg-black w-screen h-screen">
      <div className="w-screen h-screen flex justify-center items-center flex-col">
        {albums}
      </div>
    </div>
  );
}

export default App;
