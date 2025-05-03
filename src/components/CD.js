import React, { useRef, useState }  from "react";
import { Link } from "react-router";
import '../index.css';

const CD = (props) => {
    const [memberSelected, setMemberSelected] = useState("");

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
    let cd_size = props.streams*1;
    let mark_size = 10;

    const map_to_angle = (number) => {
        return ((2*Math.PI)/13)*number
    }

    for (const member of props.members) {
        x = cd_size/2 * Math.cos(map_to_angle(member_mapping[member]) + Math.PI/2);
        y = cd_size/2 * Math.sin(map_to_angle(member_mapping[member]) + Math.PI/2);
        
        marks.push(<div style={{height: mark_size, width: mark_size, left: cd_size/2 - mark_size/2 + x, top: cd_size/2 - mark_size/2 - y}} className="hover:cursor-pointer absolute bg-gray-600 rounded-[50%]"></div>)
    }

    return (
        <div style={{width: cd_size, height: cd_size}} className={`bg-gray-300 cd-fade-in mr-1 relative rounded-[50%]`}>
            {marks}
        </div>
    )
}

export default CD;