import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import data from "./data.json";

import Album from "./components/Album.js";
import CD from "./components/CD.js";
import Photocard from "./components/Photocard.js";

function App() {
  const [focusedAlbum, setFocusedAlbum] = useState("Face the Sun");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [memberFocused, setMemberFocused] = useState("");
  const [memberSelected, setMemberSelected] = useState("");
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);

  useEffect(() => {
    //console.log(focusedAlbum);
  }, [focusedAlbum])

  let albums = [];

  for (const album_name in data) {
    albums.push(<Album selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} focusedAlbum={focusedAlbum} setFocusedAlbum={setFocusedAlbum} name={`${album_name}`} year={data[album_name]["release_year"]} setMemberSelected={setMemberSelected}/>)
  }

  let songs = [];
  let scale = 23;
  const process_streams = (streams) => {
    //return 1.65*3*Math.pow(streams, 0.54); // fixes size relative to each other, kinda
    //return 2.25*streams;
    let output = streams;
    if (streams > 100) {
      // output = 2*23*Math.pow((streams/2), 0.2);
      //console.log(`called: ${streams} -> ${output}`);
    } else if (streams < 38) {
      //output = 20 + Math.pow(streams, 0.85);
      // output = 10 + Math.pow(streams, 0.98);
    }

    output = Math.pow((streams/Math.PI), 0.5);
    console.log(output);

    return output;

  };

  if (selectedAlbum != "") {

    for (const song in data[selectedAlbum]["songs"]) {
      songs.push(<CD streams={scale*process_streams(data[selectedAlbum]["songs"][song]["streams"])} members={data[selectedAlbum]["songs"][song]["members"]} setMemberFocused={setMemberFocused} setClientX={setClientX} setClientY={setClientY} setMemberSelected={setMemberSelected} memberSelected={memberSelected}/>)
    }
  }

  return (
    <div className="bg-black w-screen h-screen">
      <div className="relative w-screen h-screen flex justify-center items-center">
        {albums}
        <div className={`absolute top-[100px] flex items-center ${selectedAlbum != "" ? "" : "hidden"}`}>
          {songs}
        </div>
        <Photocard memberFocused={memberFocused} clientX={clientX} clientY={clientY}/>
      </div>
    </div>
  );
}

export default App;
