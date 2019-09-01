import * as THREE from 'three';

export const build = () => {
    const scene = new THREE.Scene();
    const basicMaterial = new THREE.MeshBasicMaterial({ color: '#1ff4bc', wireframe: true });
    const diamondGeometry = new THREE.OctahedronBufferGeometry(2, 1);
    const diamond = new THREE.Mesh(diamondGeometry, basicMaterial);
    diamond.position.set(0,0,0);
    scene.add(diamond);

    const animate = () => {
        diamond.rotation.y += 0.01;
    }

    return {scene: scene, animate: animate};
}

