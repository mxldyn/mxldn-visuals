import * as THREE from 'three';
import { brotliCompress } from 'zlib';

export const build = () => {
    const cubeSize = .5;
    const cubePad = 5;
    const scene = new THREE.Scene();
    const basicMaterial = new THREE.MeshBasicMaterial({ color: '#1ff4bc', wireframe: true });

    const planeGeometry = new THREE.PlaneBufferGeometry(100, 100, 20, 20);
    const plane = new THREE.Mesh(planeGeometry, basicMaterial);
    plane.position.set(0, 0, -20);
    scene.add(plane);

    const boxGeometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, 20, 20);
    const boxes = [... new Array(10)]
                    .map( (item, i) => {
                        const box = new THREE.Mesh(boxGeometry, basicMaterial);                        
                        box.position.set((i * cubeSize) + cubePad, 0, 0 );
                        scene.add(box);
                        return box;
                    });

    const animate = () => {
        boxes.map( (box) => box.rotation.y += 0.01 );
    }

    return {scene: scene, animate: animate};
}

