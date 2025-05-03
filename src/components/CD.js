import React, { useRef, useState, useEffect }  from "react";
import { Link } from "react-router";
import '../index.css';

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
    let cd_size = props.streams*2.25;
    let mark_size = 15;

    const map_to_angle = (number) => {
        return ((2*Math.PI)/13)*number
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
        x = cd_size/2 * Math.cos(map_to_angle(member_mapping[member]) + Math.PI/2);
        y = cd_size/2 * Math.sin(map_to_angle(member_mapping[member]) + Math.PI/2);
        
        marks.push(<div onMouseDown={() => {select_member(member)}} onMouseEnter={(e) => {props.setMemberFocused(member); props.setClientX(e.target.getBoundingClientRect().left); props.setClientY(e.target.getBoundingClientRect().top)}} onMouseLeave={() => {props.setMemberFocused("")}} style={{height: mark_size, width: mark_size, left: cd_size/2 - mark_size/2 + x, top: cd_size/2 - mark_size/2 - y}} className={`hover:cursor-pointer absolute bg-gray-600 rounded-[50%]`}></div>)
    }

    return (
        <div style={{width: cd_size, height: cd_size}} className={`bg-gray-300 member-select-transition cd-fade-in mr-2 relative rounded-[50%] ${props.memberSelected != "" && !containsMemberSelected ? "opacity-50" : "opacity-100"}`}>
            {marks}
        </div>
    )
}

export default CD;