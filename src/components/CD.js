import React, { useRef, useState, useEffect }  from "react";
import { Link } from "react-router";
import '../index.css';

import DonutSector from "./DonutSector";

const CD = (props) => {
    const [containsMemberSelected, setContainsMemberSelected] = useState(false);

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

    let marks = [];
    let x;
    let y;
    let cd_size = props.streams; // diameter ?
    let mark_size = 15;
    let mark_stroke_width = 3.5; // needs to be function of cd_size
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

    for (const member of props.members) {
        x = cd_size/2 * Math.cos(map_to_angle_radians(member_mapping[member]));
        y = cd_size/2 * Math.sin(map_to_angle_radians(member_mapping[member]));

        marks.push(<DonutSector innerRadius={cd_size/2 - cd_size/11} outerRadius={cd_size/2} sweepAngle={sweep_angle} startAngle={map_to_angle_degrees(member_mapping[member])} stroke_width={mark_stroke_width} onMouseDown={() => {select_member(member)}} onMouseEnter={(e) => {props.setMemberFocused(member); props.setClientX(e.target.getBoundingClientRect().left - e.target.getBoundingClientRect().width); props.setClientY(e.target.getBoundingClientRect().top + e.target.getBoundingClientRect().height)}} onMouseLeave={() => {props.setMemberFocused("")}} className={`${props.memberSelected != "" && !containsMemberSelected ? "pointer-events-none": "hover:cursor-pointer"}`}/>);
    }

    // generate left and top offsets in app.js?

    return (
        <div style={{width: cd_size, height: cd_size}} className={`bg-gray-300 member-select-transition cd-fade-in mr-2 relative rounded-[50%] ${props.memberSelected != "" && !containsMemberSelected ? "opacity-40" : "opacity-100"}`}>
            <svg className='absolute' width={cd_size/2 * 2} height={cd_size/2 * 2} viewBox={`${-cd_size/2} ${-cd_size/2} ${cd_size/2 * 2} ${cd_size/2 * 2}`}>
                {marks}
            </svg>
        </div>
    )
}

export default CD;