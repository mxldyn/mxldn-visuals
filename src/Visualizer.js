import React, { useRef, useEffect, useState } from "react";
import * as WORLD from "./World.js";

const Visualizer = (props) => {
  const mount = useRef(null);
  const frameId = useRef(null);
  const [world, setWorld] = useState(() => 
    WORLD.build(window.innerWidth, 
        window.innerHeight, 
        window.devicePixelRatio));
  const [running, setRunning] = useState(false);

  // Initialize
  useEffect( () => {
    mount.current.appendChild(world.renderer.domElement);
    
    window.addEventListener("resize", () => {
        WORLD.handleResize(world, 
            mount.current.clientWidth, 
            mount.current.clientHeight);
    });

    configureKeys(world);

    return () => {
      window.cancelAnimationFrame(frameId.current);
    }
  }, []);

  const animate = (world) => {
    WORLD.animate(world);
    WORLD.render(world);
    frameId.current = window.requestAnimationFrame( () => { animate(world) } );
  };

  const start = (world) => {
      animate(world);
      setRunning(true);
  }

  const configureKeys = (world) =>{
    document.addEventListener(
      "keydown",
      event => {
        WORLD.processKeydown(world, event);
      },
      false
    );  
  };

  if (!running)
    start(world);

  return <div id={props.id} className="vis" ref={mount}></div>;
}

export default Visualizer;
