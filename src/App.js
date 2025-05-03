import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import data from "./data.json";

import Album from "./components/Album.js";
import CD from "./components/CD.js";

function App() {
  const [focusedAlbum, setFocusedAlbum] = useState("Face the Sun");
  const [selectedAlbum, setSelectedAlbum] = useState("");

  useEffect(() => {
    //console.log(focusedAlbum);
  }, [focusedAlbum])

  let albums = [];

  for (const album_name in data) {
    albums.push(<Album selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} focusedAlbum={focusedAlbum} setFocusedAlbum={setFocusedAlbum} name={`${album_name}`} year={data[album_name]["release_year"]}/>)
  }

  let songs = [];

  if (selectedAlbum != "") {
    for (const song in data[selectedAlbum]["songs"]) {
      songs.push(<CD streams={data[selectedAlbum]["songs"][song]["streams"]} members={data[selectedAlbum]["songs"][song]["members"]}/>)
    }
  }

  return (
    <div className="bg-black w-screen h-screen">
      <div className="relative w-screen h-screen flex justify-center items-center">
        {albums}
        <div className={`absolute top-[75px] flex items-center ${selectedAlbum != "" ? "" : "hidden"}`}>
          {songs}
        </div>
      </div>
    </div>
  );
}

export default App;
