import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

let controls;
let scene;
let camera;
let renderer;
let composer;
let path;

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

	postProcessing(scene, camera, renderer)
}

function modifyScene(sc, c) {
	//sc.background = new THREE.Color().setRGB(1, 1, 1);

	sc.background = new THREE.TextureLoader().load('./public/textures/background.png');
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
	gltfLoader.load('./public/models/Keyboard_Model.glb', function ( gltf) {
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

	gltfLoader.load('./public/models/Keyboard_Scene.glb', function ( gltf) {
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

	const points = [
		new THREE.Vector3(1.8, 2.4, 0),
		new THREE.Vector3(4, 4, 0),
		new THREE.Vector3(8, 8, 0),
	];

	path = new THREE.CatmullRomCurve3(points);

	const pathGeometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
	const pathMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
	const pathObject = new THREE.Line(pathGeometry, pathMaterial);
	scene.add(pathObject);
}

function postProcessing(s, c, r) {
	composer = new EffectComposer( r );

	const renderPass = new RenderPass( s, c );
	composer.addPass( renderPass );

	const outputPass = new OutputPass();
	composer.addPass( outputPass );
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
	camera.aspect =  window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);;

	renderer.render(scene, camera);
	composer.render();
}

main();
update();