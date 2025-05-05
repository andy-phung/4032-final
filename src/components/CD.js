import React, { useRef, useState, useEffect }  from "react";
import { Link } from "react-router";
import '../index.css';

import DonutSector from "./DonutSector";

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

const CD = (props) => {
    const [containsMemberSelected, setContainsMemberSelected] = useState(false);
    const [CDSelected, setCDSelected] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);
    const [fadeInAnimation, setFadeInAnimation] = useState(false);

    const animation_delay = props.delay;
    console.log(`delay ${props.delay}`);

    useEffect(() => {
        if (props.members.includes(props.memberSelected)) {
            setContainsMemberSelected(true);
        } else {
            setContainsMemberSelected(false);
        }

    }, [props.memberSelected])

    const member_mapping = {
        "S.Coups": 0,
        "Jeonghan": 1,
        "Joshua": 2,
        "Jun": 3,
        "Hoshi": 4,
        "Wonwoo": 5,
        "Woozi": 6,
        "The8": 7,
        "Mingyu": 8,
        "DK": 9,
        "Seungkwan": 10,
        "Vernon": 11,
        "Dino": 12
    }

    function mapRange(value, oldMin, oldMax, newMin, newMax) {
        return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
      }

    let marks = [];
    let x;
    let y;
    let cd_size = props.streams; // diameter ?
    let mark_stroke_width = mapRange(cd_size, 0, 266, 2, 5.5); // needs to be function of cd_size
    let sweep_angle = 360/13 - (mark_stroke_width/(cd_size/2)) * (180/Math.PI); // based on 13 members and degrees, but needs to be function of mark_stroke_width

    const map_to_angle_radians = (number) => {
        return (((2*Math.PI)/13)*number + Math.PI/2); // was for circular marks
    }

    const map_to_angle_degrees = (number) => {
        return 360 - ((((2*Math.PI)/13)*number) * (180/Math.PI) + sweep_angle/2) // // convert to degrees -> subtract half of sweep angle
    }

    const select_member = (member) => {
        if(props.memberSelected == "") {
            props.setMemberSelected(member)
        } else {
            props.setMemberSelected("");
        } 
        // what if they try to select another member while a member is alr selected
        // or what if they try to deselect by clicking on another member
        // should they be forced to deselect by clicking only on that member again? or should clicking anywhere else do that
        // clicking on woozi doesn't do anything visually.. 
    }

    let mark_thickness = cd_size/11;
    // add +mark_thickness/2 to inner and outer radii for mark sticking out

    for (const member of props.members) {
        x = cd_size/2 * Math.cos(map_to_angle_radians(member_mapping[member]));
        y = cd_size/2 * Math.sin(map_to_angle_radians(member_mapping[member]));

        marks.push(<DonutSector innerRadius={cd_size/2 - mark_thickness} outerRadius={cd_size/2} sweepAngle={sweep_angle} startAngle={map_to_angle_degrees(member_mapping[member])} stroke_width={mark_stroke_width} onMouseDown={() => {select_member(member)}} onMouseEnter={(e) => {props.setMemberFocused(member); props.setClientX(e.target.getBoundingClientRect().left - e.target.getBoundingClientRect().width); props.setClientY(e.target.getBoundingClientRect().top + e.target.getBoundingClientRect().height)}} onMouseLeave={() => {props.setMemberFocused("")}} className={`${props.memberSelected != "" && !containsMemberSelected ? "pointer-events-none": "hover:cursor-pointer"}`}/>);
    }

    // generate left and top offsets in app.js?

    const cd_mouse_down = (e) => {
        setDisableTransition(true);

        if(CDSelected) {
            setCDSelected(false);
        } else {
            setCDSelected(true);
        }
    };

    let border_thickness = 3;
    if (cd_size > 180) {
        border_thickness = 2.5
    } else if (cd_size > 120) {
        border_thickness = 2;
    }
    else {
        border_thickness = 1.5;
    }
    

    return (
        <div style={{left: props.offset[0], top: parseInt(props.offset[1]), width: cd_size, height: cd_size, animation: disableTransition ? "" : props.selectedAlbum != "" ? `${1.1 + animation_delay}s cd-fade-in-animation ease-out` : `${1.1 + animation_delay}s cd-fade-out-animation ease-out`}} className={`${CDSelected ? "cd-spin" : ""} bg-gray-300 member-select-transition mt-0 relative items-center justify-center rounded-[50%] flex ${props.memberSelected != "" && !containsMemberSelected ? "opacity-40" : "opacity-100"}`}>
            <div style={{width: 0.337 * cd_size, height: 0.337 * cd_size, borderWidth: border_thickness}} onMouseDown={cd_mouse_down} className={`bg-gray-300 z-[1] border-black rounded-[50%] hover:cursor-pointer flex items-center justify-center`}>
                <div style={{width: 0.189 * cd_size, height: 0.189 * cd_size}} className="bg-black rounded-[50%]">

                </div>
            </div>
            <svg className='absolute overflow-visible' width={cd_size/2 * 2} height={cd_size/2 * 2} viewBox={`${-cd_size/2} ${-cd_size/2} ${cd_size/2 * 2} ${cd_size/2 * 2}`}>
                {marks}
            </svg>
        </div>
    )
}

export default CD;