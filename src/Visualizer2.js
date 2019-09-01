import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { GUI }from "dat.gui";
import * as SCENES from "./scenes/index.js";

const Visualizer2 = () => {
  const mount = useRef(null);  
  const [toolsEnabled, setToolsEnabled] = useState(false);

  const outRender = (camera, devCamera, renderer, scenes, sceneId) => {
    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;

    if (!toolsEnabled)
    {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setViewport(0, 0, width , height);
      renderer.render(scenes[sceneId].scene, camera);
    }
    else
    {
      camera.aspect = 0.5 * width / height;
      camera.updateProjectionMatrix();
  
      devCamera.aspect = 0.5 * width / height;
      devCamera.updateProjectionMatrix();
      
      renderer.setViewport(0, 0, width / 2 , height);
      renderer.render(scenes[sceneId].scene, camera);
      
      renderer.setViewport(width / 2, 0, width / 2, height);
      renderer.render(scenes[sceneId].scene, devCamera);
    }
  }  

  const outToggleTools = (scene, renderer, cameraHelper, render) => {
    const helper = scene.getObjectByName("__cameraHelper");

    console.log(helper);
    renderer.clear();

    if (!helper)
    {
      scene.add(cameraHelper);
      render();
      setToolsEnabled(true);
    }
    else
    {
      scene.remove(helper);
      render();
      setToolsEnabled(false);
    }

  }
    
  useEffect(() => {
    const gui = new GUI();
    let frameId, sceneId = 0, scenes;
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    let controls;

    const config = {
      backgroundColor: new THREE.Color(0, 0, 0)
    };

    const animate = () => {
      scenes.map(scene => {
        scene.animate();
        camera.lookAt(scene.scene.position);
        devCamera.lookAt(scene.scene.position);
      });

      render();
      frameId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      renderer.setSize(width, height);

      if (toolsEnabled)
      {
        camera.aspect = 0.5 * width / height;
        devCamera.aspect = 0.5 * width / height;
      }
      else
      {
        camera.aspect = width / height;
        devCamera.aspect = width / height;
      }
      
      camera.updateProjectionMatrix();
      devCamera.updateProjectionMatrix();
      render();
    };

    const render = () => {
      outRender(camera, devCamera, renderer, scenes, sceneId);
    }

    const toggleTools = () => {
      outToggleTools (scenes[sceneId].scene, renderer, cameraHelper, render);
    }

    const setupGui = () => {
      const cf = gui.addFolder("Camera");
      cf.add(camera.position, "x", 0, 200, 5).name("x").onChange(render);      
      cf.add(camera.position, "y", 0, 200, 5).name("y").onChange(render);      
      cf.add(camera.position, "z", 0, 200, 5).name("z").onChange(render);      
    }

    const camera = new THREE.PerspectiveCamera(100, width / height, 1);
    camera.position.z = -5;
    camera.position.y = 0;
    camera.updateMatrix();
    
    const devCamera = new THREE.PerspectiveCamera(100, width / height, 1);
    devCamera.position.z = 5;
    devCamera.position.y = 0;
    devCamera.updateMatrix();

    const cameraHelper = new THREE.CameraHelper(camera);
    cameraHelper.name = "__cameraHelper";

    scenes = SCENES.Build();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(config.backgroundColor);
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;

    var orbit = new OrbitControls(camera, renderer.domElement);
    orbit.target.set(0, 0, 0);
    orbit.update();

    controls = { renderer, animate };
    mount.current.appendChild(renderer.domElement);

    frameId = window.requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);

    setupGui();

    const changeScene = () => {
      if (sceneId > scenes.length - 2) sceneId = 0;
      else sceneId++;
  
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(controls.animate);
    };

    configureKeys(changeScene, orbit, toggleTools);
  
    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("keydown");
    };
  }, []);

  const configureKeys = (changeScene, orbit, toggleTools) =>{
    document.addEventListener(
      "keydown",
      event => {
        switch (event.keyCode) {
          case 32: // space
            changeScene();
            break;
          case 39: // right
            orbit.target.x++;
            break;
          case 37: // left
            orbit.target.x--;
            break;
          case 38: // up
            orbit.target.y++;
            break;
          case 40: // down
            orbit.target.y--;
            break;
          case 65: // a
            orbit.target.z++;
            break;
          case 90: // z
            orbit.target.z--;
            break;
          case 84: //t
            toggleTools();
            break;
          default:
        }
      },
      false
    );  
  };

  return <div className="vis" ref={mount}></div>;
};

export default Visualizer;


