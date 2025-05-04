import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import data from "./data.json";

import Album from "./components/Album.js";
import CD from "./components/CD.js";
import Photocard from "./components/Photocard.js";

const radians_to_degrees = (radians) => {
  return radians * (180 / Math.PI)
}

const offset_rotate_around = (angle, spacing, prev_cd_radius, cd_radius, prev_cd_offsets) => { // angle in degrees, spacing in px
  let cx1, cy1, distance, offset_x, offset_y;

  cx1 = -prev_cd_radius*2 + (prev_cd_radius - cd_radius) + prev_cd_offsets[0];
  cy1 = prev_cd_offsets[1];
  // console.log(`song -> cx1: ${cx1}, cy1: ${cy1}`);
  distance = prev_cd_radius + cd_radius + spacing;

  offset_x = cx1 + distance*Math.cos(angle * (Math.PI / 180));
  offset_y = cy1 + distance*Math.sin(angle * (Math.PI / 180));

  return [offset_x, offset_y];

}


const calculate_offsets = (cd_radii, spacing) => { // obj of cd sizes
  let cd_offsets = [];
  let new_offsets;
  let going_ccw;
  let prev_cd_radius;
  let prev_cd_inner_radius;
  let cd_radius;
  let angle;

  // set initial direction
  if(Object.keys(cd_radii).length > 1) {
    if(cd_radii[Object.keys(cd_radii)[0]] < cd_radii[Object.keys(cd_radii)[1]]) {
      going_ccw = true;
    } else {
      going_ccw = false;
    }
  } else {
    going_ccw = true;
  }



  Object.keys(cd_radii).forEach((song, idx) => {
    if (idx != 0) {
      prev_cd_radius = cd_radii[Object.keys(cd_radii)[idx - 1]];
      prev_cd_inner_radius = 0.337 * prev_cd_radius;
      cd_radius = cd_radii[song];
      

      // doesn't match up w inner circle.. sometimes too much sometimes too little
      // also overlaps sometimes
      angle = radians_to_degrees(Math.acos((cd_radius + prev_cd_inner_radius)/(prev_cd_radius + spacing + cd_radius)));
      console.log(`angle ${angle}, going ${going_ccw ? "ccw" : "cw"}`);

      if (idx == 1) {
        angle = angle*(2/3);
      } else if (idx == Object.keys(cd_radii).length - 1) {
        angle = angle/2;
      }

      if (going_ccw) {
        new_offsets = offset_rotate_around(360 - angle, spacing, prev_cd_radius, cd_radius, [cd_offsets[Object.keys(cd_radii)[idx - 1]][0], cd_offsets[Object.keys(cd_radii)[idx - 1]][1]]);
      } else {
        new_offsets = offset_rotate_around(angle, spacing, prev_cd_radius, cd_radius, [cd_offsets[Object.keys(cd_radii)[idx - 1]][0], cd_offsets[Object.keys(cd_radii)[idx - 1]][1]]);
      }

      going_ccw = !going_ccw;

      cd_offsets[song] = [new_offsets[0], new_offsets[1]];
    } 
    else {
      cd_offsets[song] = [0, 0];
    }
  });

  return cd_offsets;
  
}

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

  let cd_radii = {};
  let cd_offsets = {};
  let songs = [];
  let scale = 26;
  
  const process_streams = (streams) => {
    //return 1.65*3*Math.pow(streams, 0.54); // fixes size relative to each other, kinda
    //return 2.25*streams;
    let output = streams;
    // if (streams > 100) {
    //   // output = 2*23*Math.pow((streams/2), 0.2);
    //   //console.log(`called: ${streams} -> ${output}`);
    // } else if (streams < 38) {
    //   //output = 20 + Math.pow(streams, 0.85);
    //   // output = 10 + Math.pow(streams, 0.98);
    // }

    output = Math.pow((streams/Math.PI), 0.5);
    //console.log(output);

    return output;

  };

  let avg_streams = 0;

  if (selectedAlbum != "") {
    songs = [];
    cd_radii = [];
    cd_offsets = [];

    avg_streams = 0;
    for (const song in data[selectedAlbum]["songs"]) {
      avg_streams += data[selectedAlbum]["songs"][song]["streams"];
    }
    avg_streams = avg_streams / Object.keys(data[selectedAlbum]["songs"]).length;


    //console.log(`avg streams: ${parseInt(avg_streams)}`);

    if (parseInt(avg_streams) <= 56) { // scaling up less streamed albums for visibility
      console.log(".");
      scale = 26*1.2;
    } else {
      scale = 26;
    }
    
    // calculate offsets here
    for (const song in data[selectedAlbum]["songs"]) {
      cd_radii[song] = (scale*process_streams(data[selectedAlbum]["songs"][song]["streams"]))/2;
    }

    cd_offsets = calculate_offsets(cd_radii, 15);


    for (const song in data[selectedAlbum]["songs"]) {
      songs.push(<CD name={song} streams={scale*process_streams(data[selectedAlbum]["songs"][song]["streams"])} members={data[selectedAlbum]["songs"][song]["members"]} setMemberFocused={setMemberFocused} setClientX={setClientX} setClientY={setClientY} setMemberSelected={setMemberSelected} memberSelected={memberSelected} offset={cd_offsets[song]} z_index={Object.keys(cd_offsets).indexOf(song)}/>)
    }
  }

  return (
    <div className="bg-black w-screen h-screen">
      <div className="relative w-screen h-screen flex justify-center items-center">
        {albums}
        <div className={`absolute top-[120px] flex items-center justify-center border-red-400 border-2 ${selectedAlbum != "" ? "" : "hidden"}`}>
          {songs}
        </div>
        <Photocard memberFocused={memberFocused} clientX={clientX} clientY={clientY}/>
      </div>
    </div>
  );
}

export default App;
