import React, { useRef, useEffect, useState }  from "react";
import { Link } from "react-router";
import '../index.css';

const Album = (props) => {
    let parsed_album_name = props.name.replaceAll(':', '');

    let album_selected = props.selectedAlbum != "";
    let is_selected = props.selectedAlbum == props.name;
    

    let self_ref = useRef(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    let [targetTop, setTargetTop] = useState(0);
    let [targetLeft, setTargetLeft] = useState(0);
    let [fullWidth, setFullWidth] = useState(220);

    
    // !album_selected -> show
    // album_selected and !is_selected -> hide
    // album_selected and is_selected -> change position to center
    
    const set_state = () => {
        if(!isTransitioning) {
            startTransition();

            //console.log("hello??");
            
            if(is_selected) {
                props.setSelectedAlbum("");
                props.setMemberSelected("");
                //setFullWidth(220);
            } else {
                props.setSelectedAlbum(props.name);
                //setFullWidth(975);
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
        //console.log(`window height ${props.windowHeight}`)
        const desiredTop = props.windowHeight * 1.075; // px from top of viewport
        // ?? why does this work

        const element = self_ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();

        const viewportCenterX = window.innerWidth / 2;
        const elementCenterX = fullWidth / 2;
        if(is_selected) {
            console.log(`.. ${fullWidth}, ${rect.left}, ${viewportCenterX}`);
        }
        setTargetLeft((-rect.left) + viewportCenterX - elementCenterX);
        setTargetTop(desiredTop - rect.top);
        
    
    }, [props.focusedAlbum, props.selectedAlbum]);

    useEffect(() => {
        const element = self_ref.current;
        if (!element) return;

        const handleTransitionEnd = () => {
            setIsTransitioning(false);
            //console.log("end transition");
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
        //console.log("start transition");
        
      };

    // replace ${full_width} if u wanna change the album sizes
    return (
        <div className="relative">
            <img src={`/images/albums/${parsed_album_name}.jpg`} ref={self_ref} onClick={set_state} onMouseEnter={mouseEnterStart} onMouseLeave={reset_transition} style={{top: album_selected && is_selected ? `${targetTop}px` : "0px", left: album_selected && is_selected ? `${targetLeft}px` : "0px", height: album_selected && is_selected ? "650px" : `220px`, width: album_selected && is_selected ? "650px" : (props.focusedAlbum == props.name ? `220px` : "30px")}} className={`${album_selected && is_selected ? "object-contain" : "object-cover"} z-[2] ml-[2px] mr-[2px] object-left relative album-transition hover:cursor-pointer ${album_selected && !is_selected ? "opacity-0 pointer-events-none" : "opacity-100"}`}/>
            <div className={`text-white absolute mt-[2px] text-nowrap overflow-hidden text-center left-0 right-0 ${props.focusedAlbum == props.name && !(album_selected && is_selected)? "" : "hidden"}`}>
                {props.name} ({props.year})
            </div>
        </div>
    )
}

export default Album;