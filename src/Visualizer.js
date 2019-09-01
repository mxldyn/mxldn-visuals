import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { GUI }from "dat.gui";
import * as SCENES from "./scenes/index.js";

const Visualizer = () => {
  const mount = useRef(null);  
  const world = useRef({});
  const [toolsEnabled, setToolsEnabled] = useState(false);

  // Initialize
  useEffect( () => {
    animate(build());
  });

  // Build a world
  const build = () => {
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    
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

    const scenes = SCENES.build();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;

    var orbit = new OrbitControls(camera, renderer.domElement);
    orbit.target.set(0, 0, 0);
    orbit.update();

    mount.current.appendChild(renderer.domElement);

    world.current = {
        camera: camera,
        devCamera: devCamera,
        cameraHelper: cameraHelper,
        renderer: renderer,
        orbit: orbit,
        scenes: scenes,
        currentScene: 0,
        frameId: 0
    };
    
    return world.current;
  }

  // Render the world
  const render = (world) => {
    const camera = world.camera; 
    const devCamera = world.devCamera; 
    const renderer = world.renderer;
    const scenes = world.scenes;
    const sceneId = world.currentScene;

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

  // Animate the world
  const animate = (w) => {
    const camera = w.camera; 
    const devCamera = w.devCamera; 
    const scenes = w.scenes;

    scenes.map(scene => {
      scene.animate();
      camera.lookAt(scene.scene.position);
      devCamera.lookAt(scene.scene.position);
    });

    render(w);
    w.frameId = window.requestAnimationFrame(() => { animate(w)} );
  };


  return <div className="vis" ref={mount}></div>;

}

export default Visualizer;
