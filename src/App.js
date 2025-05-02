import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import data from "./data.json";

import Album from "./components/Album.js";
import CD from "./components/CD.js";

function App() {
  const [selectedAlbum, setSelectedAlbum] = useState("");

  let albums = [];

  for (const album_name in data) {
    albums.push(<Album selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} name={`${album_name}`} year={data[album_name]["release_year"]}/>)
  }

  let songs = [];

  if (selectedAlbum != "") {
    for (const song in data[selectedAlbum]["songs"]) {
      songs.push(<CD/>)
    }
  }

  return (
    <div className="bg-black w-screen h-screen">
      <div className="relative w-screen h-screen flex justify-center items-center flex-col">
        {albums}
        <div className={`absolute flex ${selectedAlbum != "" ? "" : "hidden"}`}>
          {songs}
        </div>
      </div>
    </div>
  );
}

export default App;
