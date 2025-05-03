import React, { useRef, useEffect, useState }  from "react";
import { Link } from "react-router";
import '../index.css';

const Album = (props) => {
    let parsed_album_name = props.name.replaceAll(':', '');
    let full_width = 175;

    let album_selected = props.selectedAlbum != "";
    let is_selected = props.selectedAlbum == props.name;

    let self_ref = useRef(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    let [targetTop, setTargetTop] = useState(0);
    let [targetLeft, setTargetLeft] = useState(0);
    
    // !album_selected -> show
    // album_selected and !is_selected -> hide
    // album_selected and is_selected -> change position to center
    
    const set_state = () => {
        if(!isTransitioning) {
            startTransition();

            if(is_selected) {
                props.setSelectedAlbum("")
            } else {
                props.setSelectedAlbum(props.name)
            }
        }
    }

    const reset_transition = () => {
        // if mid transition, reset and set width to unfocused

        if (isTransitioning && self_ref.current) {
            // console.log("??");
            // self_ref.current.classList.remove('album-transition');
            // self_ref.current.classList.remove('w-[175px]');
            // self_ref.current.classList.add('w-[30px]');
            // self_ref.current.style.transition = `left 0.5s, top 0.5s, opacity 0.5s, width 0.1s`;
            // void self_ref.current.offsetWidth;
            // // self_ref.current.classList.remove('album-transition-fast');
            // self_ref.current.style.transition = ``;
            // self_ref.current.classList.add('album-transition');
            
        }

    }

    useEffect(() => {
        //console.log("recalc");
        const desiredTop = 575; // px from top of viewport
    
        const element = self_ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();

        const viewportCenterX = window.innerWidth / 2;
        const elementCenterX = full_width / 2;
        //console.log(rect.left);
        setTargetLeft(-rect.left + viewportCenterX - elementCenterX);
        setTargetTop(desiredTop - rect.top);
        
    
    }, [props.focusedAlbum, props.selectedAlbum]);

    useEffect(() => {
        const element = self_ref.current;
        if (!element) return;

        const handleTransitionEnd = () => {
            setIsTransitioning(false);
        };
        
        if (element) {
            element.addEventListener('transitionend', handleTransitionEnd);
        }
        
        return () => {
            if (element) {
            element.removeEventListener('transitionend', handleTransitionEnd);
            }
        };
    }, []);

    const mouseEnterStart = () => {
        if((props.focusedAlbum != props.name) && !isTransitioning) {
            startTransition();
        }

        props.setFocusedAlbum(props.name);
        
        
    }

    const startTransition = () => {
        setIsTransitioning(true);
        
      };

    return (
        <>
            <img src={`/images/albums/${parsed_album_name}.jpg`} ref={self_ref} onClick={set_state} onMouseEnter={mouseEnterStart} onMouseLeave={reset_transition} style={{top: album_selected && is_selected ? `${targetTop}px` : "0px", left: album_selected && is_selected ? `${targetLeft}px` : "0px", height: album_selected && is_selected ? "500px" : `${full_width}px`}} className={`text-white mr-[5px] ${album_selected && is_selected ? "w-[500px]" : (props.focusedAlbum == props.name ? `w-[${full_width}px]` : "w-[30px]")} object-cover object-left relative album-transition hover:cursor-pointer ${album_selected && !is_selected ? "opacity-0 pointer-events-none" : "opacity-100"}`}/>

        </>
    )
}

export default Album;