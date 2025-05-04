import React, { useRef, useState }  from "react";
import { Link } from "react-router";
import '../index.css';

const Photocard = (props) => {

    // need to change photocard position based on angular position prob..
    // tbh don't use mouse x and y, just set based on mark position
    return (
        <div style={{left: props.clientX, top: props.clientY - 25}} className={`text-white pointer-events-none absolute z-[3] photocard-transition ${props.memberFocused != "" ? "" : "hidden"}`}>
            {props.memberFocused}
        </div>
    )
}

export default Photocard;