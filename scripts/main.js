import * as THREE from 'three';

function main() {
	const canvas = document.getElementById("ThreeJSCanvas");
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 1;
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.x = -2; camera.position.y = 2; camera.position.z = 2;  
    camera.lookAt(0, 0, 0);

	const scene = new THREE.Scene();

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	const material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ); // greenish blue

	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

    const light = new THREE.DirectionalLight(0xFFFFFF, 2);
    light.position.set(2, 2, 2);
    scene.add(light);

	renderer.render( scene, camera );

}

main();