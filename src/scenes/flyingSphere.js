import * as THREE from 'three';

export const build = () => {
    const scene = new THREE.Scene();
    const basicMaterial = new THREE.MeshBasicMaterial({ color: '#1ff4bc', wireframe: true });
    const sphereGeometry = new THREE.SphereBufferGeometry(2.0, 20, 20);
    const sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,0,0);
    scene.add(sphere);

    const animate = () => {
        sphere.rotation.y += 0.01;
    }

    return {scene: scene, animate: animate};
}

