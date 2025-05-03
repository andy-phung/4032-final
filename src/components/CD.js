import React, { useRef, useState }  from "react";
import { Link } from "react-router";
import '../index.css';

const CD = (props) => {

    const mapping = {
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

    for (const member in props.members) {
        marks.push(<div className="w-[20px] h-[20px] bg-gray-600 rounded-[50%]"></div>)
    }

    return (
        <div style={{width: props.streams, height: props.streams}} className={`bg-gray-300 mr-1 rounded-[50%]`}>
            {marks}
        </div>
    )
}

export default CD;