import React, { useRef, useEffect, useState } from "react";
import * as WORLD from "./World.js";

const Visualizer = () => {
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
        switch (event.keyCode) {
          case 32: // space
            WORLD.changeScene(world);
            break;
          case 39: // right
            world.orbit.target.x++;
            break;
          case 37: // left
            world.orbit.target.x--;
            break;
          case 38: // up
            world.orbit.target.y++;
            break;
          case 40: // down
            world.orbit.target.y--;
            break;
          case 65: // a
            world.orbit.target.z++;
            break;
          case 90: // z
            world.orbit.target.z--;
            break;
          case 84: //t
            WORLD.toggleTools(world);
            break;
          default:
        }
      },
      false
    );  
  };

  if (!running)
    start(world);

  return <div className="vis" ref={mount}></div>;
}

export default Visualizer;
