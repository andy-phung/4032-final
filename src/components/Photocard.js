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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const creditSuffix = (creditNumber) => {
    if(creditNumber < 4) {
        if (creditNumber == 1) {
            return "ST"; 
        } else if (creditNumber == 2) {
            return "ND";
        } else {
            return "RD";
        }
    } else {
        return "TH";
    }
}

const Photocard = (props) => {

    // props.photocardColor, props.creditNumber
    console.log(`color ${props.photocardColor}, ${props.creditNumber}`);

    // need to change photocard position based on angular position prob..
    // tbh don't use mouse x and y, just set based on mark position
    return (
    <div style={{left: props.clientX - 110, top: props.clientY - 75, backgroundColor: props.photocardColor, borderColor: props.bgColor, color: getContrastYIQ(props.photocardColor)}} className={`h-[160px] border-[4px] rounded-[4px] photocard-aspect-ratio bg-white pointer-events-none absolute z-[3] photocard-transition ${props.memberFocused != "" ? "" : "hidden"} flex flex-col justify-start items-center`}>
        <img src={`/images/photocards/${props.memberFocused}.jpg`} className="h-[100px] mt-[10px] mb-[5.5px]"/>
        <div className="text-[13px] urbanist-bold">
            {String(props.memberFocused).toUpperCase()}
        </div>
        <div className="text-[8px] urbanist mt-[-3px]">
            {String(props.creditNumber) + creditSuffix(props.creditNumber)} CREDIT
        </div>
    </div>
    )
}

export default Photocard;