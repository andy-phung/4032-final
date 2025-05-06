import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import data from "./data.json";

import Album from "./components/Album.js";
import CD from "./components/CD.js";
import Photocard from "./components/Photocard.js";
import SongCard from "./components/SongCard.js";

function generateEvenlySpacedValues(start, end, numValues) {
  if (numValues < 1) {
    throw new Error("numValues must be at least 1.");
  }

  if (numValues === 1) {
    return [0.1];
  }

  const step = (end - start) / (numValues - 1);
  const result = [];

  for (let i = 0; i < numValues; i++) {
    result.push(start + step * i);
  }

  return result;
}

const get_bounding_box = (x_start, y_start, radii, offsets) => { // radii is an array

  let first_cd_left = x_start;
  let first_cd_top = y_start;

  // need to get all cd top left corners, apply the offsets to each one, and find which one is farthest down + which farthest right, then add their radii 

  let cd_positions = [];
  let farthest_up = Number.POSITIVE_INFINITY;
  let farthest_left = Number.POSITIVE_INFINITY;
  let farthest_right = -1;
  let farthest_down = -1;

  // im fucking stupid bruh

  for (let i = 0; i < radii.length; i++) {
    if(i == 0) {
      cd_positions.push([first_cd_left, first_cd_top]);
    } else {
      cd_positions.push([cd_positions[i - 1][0] + radii[i - 1]*2, cd_positions[i - 1][1] + radii[i - 1] - radii[i]]);
    }
  }

  let pos_w_offset;

  let cd_absolute_positions = [];

  for (let idx = 0; idx < cd_positions.length; idx++) {
    pos_w_offset = [cd_positions[idx][0] + offsets[idx][0], cd_positions[idx][1] + offsets[idx][1]];
    cd_absolute_positions.push(pos_w_offset[0], pos_w_offset[1]);
    //pos_w_offset = [cd_positions[idx][0], cd_positions[idx][1]];

    if(pos_w_offset[0] + radii[idx]*2 > farthest_right) {
      farthest_right = pos_w_offset[0] + radii[idx]*2;
    }

    if(pos_w_offset[1] + radii[idx]*2 > farthest_down) {
      farthest_down = pos_w_offset[1] + radii[idx]*2;
    }

    if(pos_w_offset[0] < farthest_left) {
      farthest_left = pos_w_offset[0];
    }

    if(pos_w_offset[1] < farthest_up) {
      farthest_up = pos_w_offset[1];
    }


  }
  
  // let last_cd_right = first_cd_left + sum_arr(radii)*2 + offsets[offsets.length - 1][0];
  // let last_cd_bottom = first_cd_top + Math.max(...radii)*2 + offsets[offsets.length - 1][1];

  return [farthest_left, farthest_up, farthest_right-farthest_left, farthest_down-farthest_up, pos_w_offset[0], pos_w_offset[1], cd_absolute_positions]

  // returns bounding box wrt to viewport
}


function sum_arr(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function sum_obj_values(obj) {
  let sum = 0;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      sum += obj[key];
    }
  }
  return sum;
}

const radians_to_degrees = (radians) => {
  return radians * (180 / Math.PI)
}

const offset_rotate_around = (angle, spacing, prev_cd_radius, cd_radius, prev_cd_offsets, prev_prev_cd_radius=null) => { // angle in degrees, spacing in px
  if(prev_prev_cd_radius != null) {
    //console.log(prev_prev_cd_radius / prev_cd_radius);
    if (prev_prev_cd_radius / prev_cd_radius > 2.2) {
      //console.log("crashing out");
      angle += 10;
    }
  }

  

  let cx1, cy1, distance, offset_x, offset_y;

  cx1 = -prev_cd_radius*2 + (prev_cd_radius - cd_radius) + prev_cd_offsets[0];
  cy1 = prev_cd_offsets[1];
  // console.log(`song -> cx1: ${cx1}, cy1: ${cy1}`);
  distance = prev_cd_radius + cd_radius + spacing;

  offset_x = cx1 + distance*Math.cos(angle * (Math.PI / 180));
  offset_y = cy1 + distance*Math.sin(angle * (Math.PI / 180));

  return [offset_x, offset_y];

}


const calculate_offsets = (cd_radii, spacing, window_width, window_height, top_offset) => { // obj of cd sizes
  let cd_offsets = [];
  let new_offsets;
  let going_ccw;
  let prev_cd_radius;
  let prev_cd_inner_radius;
  let cd_radius;
  let angle;

  //console.log(cd_radii);

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

  let bb_x, bb_y, bb_width, bb_height, last_cd_x, last_cd_y, y_offset; 

  Object.keys(cd_radii).forEach((song, idx) => {
    if (idx != 0) {
      prev_cd_radius = cd_radii[Object.keys(cd_radii)[idx - 1]];
      prev_cd_inner_radius = 0.337 * prev_cd_radius;
      cd_radius = cd_radii[song];
      

      // doesn't match up w inner circle.. sometimes too much sometimes too little
      // also overlaps sometimes
      angle = radians_to_degrees(Math.acos((cd_radius + prev_cd_inner_radius)/(prev_cd_radius + spacing + cd_radius)));
      //console.log(`angle ${angle}, going ${going_ccw ? "ccw" : "cw"}`);

      if (idx == 1) {
        angle = angle*(2/3);
      } else if (idx == Object.keys(cd_radii).length - 1) {
        angle = angle/2;
      }

      //[bb_x, bb_y, bb_width, bb_height, last_cd_x, last_cd_y] = get_bounding_box((window_width - sum_obj_values(cd_radii)*2)/2, top_offset+Math.max(...Object.values(cd_radii))-cd_radii[Object.keys(cd_radii)[0]], Object.entries(cd_radii).slice(0,idx).map(entry => entry[1]), Object.entries(cd_offsets).slice(0,idx).map(entry => entry[1]));
      // ^bounding box for all cds with offsets defined

      y_offset = (prev_cd_radius + spacing + cd_radius) * Math.cos(angle * (Math.PI / 180));

      // if (last_cd_y + (prev_cd_radius - cd_radius) + y_offset + cd_radius*2) - (bb_y + bb_height) > threshold
      // i give up bruh
      if (Object.keys(cd_radii)[idx - 1] == "My My" && song == "Kidult") {
        angle -= 25;
      }

      if (going_ccw) {
        new_offsets = offset_rotate_around(360 - angle, spacing, prev_cd_radius, cd_radius, [cd_offsets[Object.keys(cd_radii)[idx - 1]][0], cd_offsets[Object.keys(cd_radii)[idx - 1]][1]], idx > 1 ? prev_cd_radius = cd_radii[Object.keys(cd_radii)[idx - 2]] : null);
      } else {
        new_offsets = offset_rotate_around(angle, spacing, prev_cd_radius, cd_radius, [cd_offsets[Object.keys(cd_radii)[idx - 1]][0], cd_offsets[Object.keys(cd_radii)[idx - 1]][1]], idx > 1 ? prev_cd_radius = cd_radii[Object.keys(cd_radii)[idx - 2]] : null);
      }

      going_ccw = !going_ccw;

      cd_offsets[song] = [new_offsets[0], new_offsets[1]];
      //cd_offsets[song] = [0, 0];
    } 
    else {
      cd_offsets[song] = [0, 0];
    }
  });

  let cd_absolute_positions;
  
  [bb_x, bb_y, bb_width, bb_height, last_cd_x, last_cd_y, cd_absolute_positions] = get_bounding_box((window_width - sum_obj_values(cd_radii)*2)/2, top_offset+Math.max(...Object.values(cd_radii))-cd_radii[Object.keys(cd_radii)[0]], Object.entries(cd_radii).slice(0,Object.keys(cd_radii).length).map(entry => entry[1]), Object.entries(cd_offsets).slice(0,Object.keys(cd_offsets).length).map(entry => entry[1]));

  return [cd_offsets, [bb_x, bb_y, bb_width, bb_height], cd_absolute_positions]; // need to return bounding box too
  
}

function App() {
  const [focusedAlbum, setFocusedAlbum] = useState("Face the Sun");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [memberFocused, setMemberFocused] = useState("");
  const [memberSelected, setMemberSelected] = useState("");
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [width, setWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1280); // ..
  const [height, setHeight] = React.useState(typeof window !== 'undefined' ? window.innerHeight : 720); // ..

  const [photocardColor, setPhotocardColor] = useState("#FFFFFF");
  const [creditNumber, setCreditNumber] = useState(0);

  const [focusedSong, setFocusedSong] = useState("");
  const [CDCenterX, setCDCenterX] = useState(0);
  const [CDCenterY, setCDCenterY] = useState(0);

  const audio = useRef(null);
  const [audioName, setAudioName] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioCurrentlyPlaying = useRef(false);

  const [introState, setIntroState] = useState(0);

  useEffect(() => {
    //console.log(`audio ${audioName}`);

    let parsed_name = String(audioName).replaceAll("*", "");
    let play_promise;

    if(audioName != "") {
      if (audioPlaying) {
        audio.current = new Audio();
        if ("mp3" in data[selectedAlbum]["songs"][audioName]) {
          audio.current.src = data[selectedAlbum]["songs"][audioName]["mp3"];
          play_promise = audio.current.play()

          if(play_promise !== undefined) {
            play_promise.then(() => {
              audioCurrentlyPlaying.current = true;
            })
          }
        }                
      } else if (audioCurrentlyPlaying.current && !audio.current.paused && audio.current.currentTime > 0) {
        audio.current.pause();
        audio.current.currentTime = 0;
      }
    }
  }, [audioPlaying]);

  useEffect(() => {
    const handleResize = () => {setWidth(window.innerWidth); setHeight(window.innerHeight);}
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial width
    //console.log(width);
    return () => window.removeEventListener('resize', handleResize); // Clean up
  }, []);

  useEffect(() => {
    //console.log(focusedAlbum);
  }, [focusedAlbum])

  let albums = [];

  for (const album_name in data) {
    albums.push(<Album setAudioPlaying={setAudioPlaying} windowHeight={height} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} focusedAlbum={focusedAlbum} setFocusedAlbum={setFocusedAlbum} name={`${album_name}`} year={data[album_name]["release_year"]} setMemberSelected={setMemberSelected}/>)
  }

  let cd_radii = {};
  let cd_offsets = {};
  let songs = [];
  let scale = 26;
  let cd_top_margin = 120;
  let bounding_box = [0, 0, 0, 0];
  
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

    if ((parseInt(avg_streams) <= 56 || selectedAlbum == "Sector 17") && selectedAlbum != "Love&Letter" && selectedAlbum != "Teen, Age" && selectedAlbum != "An Ode" && selectedAlbum != "You Made My Dawn") { // scaling up less streamed albums for visibility
      //console.log(".");
      scale = 26*1.55;
    } else {
      scale = 26 * 1.2;
    }
    
    // calculate offsets here


    for (const song in data[selectedAlbum]["songs"]) {
      cd_radii[song] = (scale*process_streams(data[selectedAlbum]["songs"][song]["streams"]))/2;
    }

    let cd_absolute_positions; 

    [cd_offsets, bounding_box, cd_absolute_positions] = calculate_offsets(cd_radii, 15, width, height, cd_top_margin);

    let x_center_offset = (width - bounding_box[2])/2 - bounding_box[0];
    //let x_center_offset = 0;

    let target_y_position = 0.4 * height;
    let y_target_offset = target_y_position - bounding_box[1] - bounding_box[3]/2;



    let animation_delay_stack = generateEvenlySpacedValues(-0.2, 0.1, Object.keys(cd_radii).length);
    let animation_delays = {};

    let cd_vertical_positions = {}

    cd_absolute_positions.reverse();
    Object.keys(cd_radii).forEach((song, idx) => {
      cd_vertical_positions[song] = cd_absolute_positions[idx];
    });

    //console.log(`cd vertical positions ${cd_vertical_positions}`);

    const entries = Object.entries(cd_vertical_positions);
    entries.sort((a, b) => a[1] - b[1]);

    for (const [song, _] of entries) {
      animation_delays[song] = animation_delay_stack.pop();
    }


    for (const song in cd_offsets) {
      cd_offsets[song][0] += x_center_offset;
      cd_offsets[song][1] += y_target_offset;
    }

    for (const song in data[selectedAlbum]["songs"]) {
      songs.push(<CD bg_color={data[selectedAlbum]["bg_color"]} cd_color={data[selectedAlbum]["cd_color"]} mark_color={data[selectedAlbum]["mark_color"]} selectedAlbum={selectedAlbum} delay={animation_delays[song]} name={song} streams={scale*process_streams(data[selectedAlbum]["songs"][song]["streams"])} members={data[selectedAlbum]["songs"][song]["members"]} setMemberFocused={setMemberFocused} memberFocused={memberFocused} clientX={clientX} clientY={clientY} setClientX={setClientX} setClientY={setClientY} setMemberSelected={setMemberSelected} memberSelected={memberSelected} offset={cd_offsets[song]} z_index={Object.keys(cd_offsets).indexOf(song)} setPhotocardColor={setPhotocardColor} setCreditNumber={setCreditNumber} albumData={data[selectedAlbum]} setFocusedSong={setFocusedSong} setCDCenterX={setCDCenterX} setCDCenterY={setCDCenterY} setAudioPlaying={setAudioPlaying} audioPlaying={audioPlaying} audioName={audioName} setAudioName={setAudioName}/>)
    }
  }

  //console.log(songs.length);

  return (
    <div style={{backgroundColor: selectedAlbum != "" ? data[selectedAlbum]["bg_color"] : "#080808"}} className="bg-fade w-screen h-screen flex justify-center items-center" onMouseDown={() => {setIntroState(introState + 1)}}>
      <div className={`text-white text-[20px] absolute z-[6] intro-fade urbanist ${introState == 0 ? "" : "opacity-0 pointer-events-none"}`}>
        SEVENTEEN is an idol group known for producing their own music.
      </div>
      <div className={`text-white text-[20px] absolute z-[6] ${introState > 1 ? "intro-2-fade-out" : "intro-2-fade"} urbanist ${introState == 1 ? "" : "opacity-0 pointer-events-none"}`}>
        How has each member contributed to this over the years?
      </div>
      <div className={`relative w-screen h-screen flex intro-2-fade justify-center items-center ${introState > 1 ? "" : "opacity-0 pointer-events-none"}`}>
        {albums}
        <div className={`absolute top-[120px] flex items-center justify-center ${selectedAlbum != "" ? "" : "opacity-0 pointer-events-none"}`}>
          {songs}
        </div>
        <Photocard memberFocused={memberFocused} clientX={clientX} clientY={clientY} photocardColor={photocardColor} creditNumber={creditNumber} bgColor={selectedAlbum != "" ? data[selectedAlbum]["bg_color"] : "#080808"}/>
        <SongCard focusedSong={focusedSong} clientX={CDCenterX} clientY={CDCenterY} photocardColor={photocardColor} bgColor={selectedAlbum != "" ? data[selectedAlbum]["bg_color"] : "#080808"}/>
      </div>
    </div>
  );
}

export default App;
