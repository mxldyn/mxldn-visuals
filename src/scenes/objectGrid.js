import * as THREE from 'three';

export const GRID = {
    buildWithCubes: () => { return build(new THREE.BoxBufferGeometry(2, 2, 2, 20, 20)); },
    buildWithSpheres: () => { return build(new THREE.SphereBufferGeometry(2, 20, 20)); },
    buildWithDiamonds: () => { return build(new THREE.OctahedronBufferGeometry(2, 1)); }
}

const build = (geometry) => {
    const scene = new THREE.Scene();
    const basicMaterial = new THREE.MeshBasicMaterial({ color: '#1ff4bc', wireframe: true });
    const mesh = new THREE.Mesh(geometry, basicMaterial);
    const grid = buildGrid(mesh, 20, 20, 3);
    const merge = [].concat.apply([],grid);
    scene.add(...merge);    

    // const planeGeometry = new THREE.PlaneBufferGeometry(100, 100, 20, 20);
    // const plane = new THREE.Mesh(planeGeometry, basicMaterial);
    // plane.position.set(0, 0, -20);
    // //plane.rotation.x = Math.PI * .5;
    // //scene.add(plane);

    const animate = () => {
        merge.map( (box) => box.rotation.y += 0.05 );
    }

    return {scene: scene, animate: animate};
}

const buildGrid = (mesh, rows, cols, pad) => 
{
    const size = (new THREE.Box3().setFromObject(mesh)).getSize();
    const width = size.x;
    const height = size.y;
    return [...new Array(rows)]
                    .map( (item, i) => {
                        const yOff = i * (height + pad) - ( (height + pad) * rows / 2) + (height + pad / 2);
                        const row = buildRow(mesh.clone(), cols, pad, yOff);
                        return row;
                    });
}

const buildRow = (mesh, cols, pad, yOff = 0) => {
    const box = new THREE.Box3().setFromObject(mesh);
    const width = box.getSize().x;
    return  [...new Array(cols)]
                    .map( (item, i) => {
                        const x = i * (width + pad) - ( (width + pad) * cols / 2) + (width + pad) / 2;
                        const m = mesh.clone();
                        m.position.set( x, yOff, 0 );
                        return m;
                    });
}

