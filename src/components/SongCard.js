import React, { useRef, useState }  from "react";
import { Link } from "react-router";
import '../index.css';

// not my code
function getContrastYIQ(hexcolor) {
    // Remove hash if present
    hexcolor = hexcolor.replace('#', '');
  
    // Convert to RGB
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
  
    // Calculate YIQ brightness
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
    // Return black or white based on brightness
    return yiq >= 133 ? 'black' : 'white';
}

const SongCard = (props) => {

    return (
        <div style={{left: props.clientX, top: props.clientY, backgroundColor: props.photocardColor, borderColor: props.bgColor, color: getContrastYIQ(props.photocardColor)}} className={`urbanist-bold text-[16px] pl-1 pr-1 rounded-[8px] border-[3px] absolute pointer-events-none text-white z-[5] ${props.focusedSong != "" ? "" : "hidden"}`}>
            {props.focusedSong}
        </div>
    )
}

export default SongCard;