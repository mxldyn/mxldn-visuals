import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import CameraControls from "camera-controls"
import { GUI } from "dat.gui";
import * as SCENES from "./scenes/index.js";

//CameraControls.install( { THREE: THREE } );

// Build a world
export const build = (width, height, pixelRatio, ) => {

    const camera = new THREE.PerspectiveCamera(100, width / height, 1);
    camera.position.z = -5;
    camera.position.y = 0;
    camera.name = "main";
    camera.updateMatrix();

    const devCamera = new THREE.PerspectiveCamera(100, width / height, 1);
    devCamera.name = "dev";
    devCamera.position.z = 5;
    devCamera.position.y = 0;
    devCamera.updateMatrix();

    const cameraHelper = new THREE.CameraHelper(camera);
    cameraHelper.name = "__cameraHelper";

    const scenes = SCENES.build();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.autoClear = false;

    var orbit = new OrbitControls(camera, renderer.domElement);
    orbit.target.set(0, 5, 0);
    orbit.enableDamping = true;
    orbit.update();

    return {
        clock: new THREE.Clock(),
        camera: camera,
        devCamera: devCamera,
        cameraHelper: cameraHelper,
        renderer: renderer,
        orbit: orbit,
        scenes: scenes,
        currentScene: 0,
        frameId: 0,
        toolsEnabled: false,
        guiControls: null
    };
}

export const render = (world) => {
    const camera = world.camera; 
    const devCamera = world.devCamera; 
    const renderer = world.renderer;
    const scenes = world.scenes;
    const sceneId = world.currentScene;

    //world.orbit.update();

    const vector = world.renderer.getSize(new THREE.Vector3(0,0,0));
    const width = vector.x;
    const height = vector.y;

    if (!world.toolsEnabled)
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
export const animate = (world) => {
    const camera = world.camera; 
    const devCamera = world.devCamera; 
    const scenes = world.scenes;

    scenes.map(scene => {
      scene.animate();
      //camera.lookAt(scene.scene.position);
      devCamera.lookAt(camera.position);
      return true;
    });
};

export const handleResize = (world, width, height) => {
    world.renderer.setSize(width, height);

    if (world.toolsEnabled)
    {
        world.camera.aspect = 0.5 * width / height;
        world.devCamera.aspect = 0.5 * width / height;
    }
    else
    {
        world.camera.aspect = width / height;
        world.devCamera.aspect = width / height;
    }
    
    world.camera.updateProjectionMatrix();
    world.devCamera.updateProjectionMatrix();
};

export const changeScene = (world) => {
    if (world.toolsEnabled)
        toggleTools(world);
    if (world.currentScene > world.scenes.length - 2) world.currentScene = 0;
        else world.currentScene++;
};

export const toggleTools = (world) => {
    const scene = world.scenes[world.currentScene].scene;

    if (!world.toolsEnabled)
    {
      scene.add(world.cameraHelper);
      showGuiControls(world);
      world.toolsEnabled = true;
    }
    else
    {
      scene.remove(world.cameraHelper);
      world.guiControls.destroy();
      world.toolsEnabled = false;
    }

    world.renderer.clear();
}

const showGuiControls = (world) => {
    world.guiControls = new GUI();
    const cf = world.guiControls.addFolder("Camera");
    cf.add(world.camera.position, "x", -200, 200, 1).name("position.x").onChange(render(world)).listen();    
    cf.add(world.camera.position, "y", -200, 200, 1).name("position.y").onChange(render(world)).listen();    
    cf.add(world.camera.position, "z", -200, 200, 1).name("position.z").onChange(render(world)).listen();    
    cf.add(world.camera.rotation, "x", -200, 200, 1).name("rotation.x").onChange(render(world)).listen();    
    cf.add(world.camera.rotation, "y", -200, 200, 1).name("rotation.y").onChange(render(world)).listen();    
    cf.add(world.camera.rotation, "z", -200, 200, 1).name("rotation.z").onChange(render(world)).listen();    
    cf.add(world.camera, "fov", 0, 1000, 1).name("fov").onChange(render(world)).listen();
    // const orf = world.guiControls.addFolder("Orbit");
    // orf.add(world.orbit.target, "x", -200, 200, 1).name("x").onChange(render(world)).listen();    
    // orf.add(world.orbit.target, "y", -200, 200, 1).name("y").onChange(render(world)).listen();    
    // orf.add(world.orbit.target, "z", -200, 200, 1).name("z").onChange(render(world)).listen();  
}

const hideGuiControls = (world) => {
    world.guiControls.destroy();  
}


export const processKeydown = (world, event) => {
    switch (event.keyCode) {
        case 32: // space
          changeScene(world);
          break;
        case 39: // right
          world.camera.position.x++;
          break;
        case 37: // left
          world.camera.position.x--;
          break;
        case 38: // up
          world.camera.position.y++;
          break;
        case 40: // down
          world.camera.position.y--;
          break;
        case 65: // a
          world.camera.position.z++;
          break;
        case 90: // z
          world.camera.position.z--;
          break;
        case 84: //t
          toggleTools(world);
          break;
        default:
      }
}

