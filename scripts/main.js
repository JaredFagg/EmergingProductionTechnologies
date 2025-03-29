import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let controls;
let scene;
let camera;
let renderer;

function main() {
	// Establishes ThreeJS Canvas, Renderer, Camera & Scene.
	const canvas = document.getElementById("ThreeJSCanvas");
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	scene = new THREE.Scene();

	// Sets correct pixel density using resolution of computer monitor
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	modifyScene(scene, camera);
	//helper(scene, camera, renderer);
	createScene(scene);
}

function modifyScene(sc, c) {
	sc.background = new THREE.Color().setRGB(1,1,1);
	c.position.set(1.8, 2.4, 0);
	c.lookAt(0, 0, 0);
}

function createScene(sc) {
	// Creates a Light
	const pointLight = new THREE.PointLight(0xffffff, 500, 100);
	pointLight.position.set(6, 15, 15);
	
	const ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(pointLight, ambientLight);

	const gltfLoader = new GLTFLoader();
	gltfLoader.load('../assets/models/Keyboard_Model.glb', function ( gltf) {
		const model = gltf.scene;
		const modelMaterial = new THREE.MeshPhongMaterial({
			color: 0x1f1f1f
		});
		model.traverse((o) => {
			if(o.isMesh) {
				o.material = modelMaterial;
			}
		})

		sc.add(model);
	});

	gltfLoader.load('../assets/models/Keyboard_Scene.glb', function ( gltf) {
		const scene = gltf.scene;
		const sceneMaterial = new THREE.MeshPhongMaterial({
			color: 0xffffff
		});
		scene.traverse((o) => {
			if(o.isMesh) {
				o.material = sceneMaterial;
			}
		})

		sc.add(scene);
	});

}

function helper(sc, c, r) {
	// Creates a grid and camera system to orbit and pan during development
	const gridHelper = new THREE.GridHelper(200, 50);
	sc.add(gridHelper);
	controls = new OrbitControls(c, r.domElement);
}

function update() {
	requestAnimationFrame(update);
	//controls.update();
	renderer.render(scene, camera);
}

main();
update();
