import React, { useRef, useEffect, useState }  from "react";
import { Link } from "react-router";
import '../index.css';

const Album = (props) => {
    let album_selected = props.selectedAlbum != "";
    let is_selected = props.selectedAlbum == props.name;

    let self_ref = useRef(null);
    let [targetTop, setTargetTop] = useState(0);
    let [targetLeft, setTargetLeft] = useState(0);
    
    // !album_selected -> show
    // album_selected and !is_selected -> hide
    // album_selected and is_selected -> change position to center
    const set_state = () => {
        if(is_selected) {
            props.setSelectedAlbum("")
        } else {
            props.setSelectedAlbum(props.name)
        }
        
    }

    useEffect(() => {
        const desiredTop = 450; // px from top of viewport
    
        const element = self_ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();

        const viewportCenterX = window.innerWidth / 2;
        const elementCenterX = rect.width / 2;
        setTargetLeft(viewportCenterX - rect.left - elementCenterX);
        setTargetTop(desiredTop - rect.top);
    
    }, []);

    return (
        <div ref={self_ref} onClick={set_state} style={{top: album_selected && is_selected ? `${targetTop}px` : "0px", left: album_selected && is_selected ? `${targetLeft}px` : "0px"}} className={`text-white relative album-transition hover:opacity-80 hover:cursor-pointer ${album_selected && !is_selected ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {props.name} ({props.year})
        </div>
    )
}

export default Album;