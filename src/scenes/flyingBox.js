import * as THREE from 'three';

export const build = () => {
    const scene = new THREE.Scene();
    const basicMaterial = new THREE.MeshBasicMaterial({ color: '#1ff4bc', wireframe: true });
    const boxGeometry = new THREE.BoxBufferGeometry(3, 3, 3, 20, 20);
    const box = new THREE.Mesh(boxGeometry, basicMaterial);
 
    box.position.set(0,0,0);
    scene.add(box);

    const animate = () => {
        box.rotation.y += 0.01;
    }

    return {scene: scene, animate: animate};
}

