import React from "react";
import { Link } from "react-router";
import '../index.css';

const Album = (props) => {
    return (
        <div className="text-white">
            {props.name}
        </div>
    )
}

export default Album;