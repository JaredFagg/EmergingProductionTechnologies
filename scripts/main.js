import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let controls;
let scene;
let camera;
let renderer;

let keyboard;

let cameraTrack;
let cameralookat;
var pathPos = 0;    

function main() {
	window.scrollTo(0, 0);
	
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
	Array(200).fill().forEach(addStar);
}

function modifyScene(sc, c) {
	//sc.background = new THREE.Color().setRGB(1, 1, 1);

	sc.background = new THREE.TextureLoader().load('./public/textures/background.png');
	c.position.set(1.8, 2.4, 0);
	c.lookAt(0, 0, 0);
}

function addStar() {
	const geometry = new THREE.SphereGeometry(THREE.MathUtils.randFloatSpread(1.5), 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
	const star = new THREE.Mesh(geometry, material);
  
	const [x, y, z] = Array(3)
	  .fill()
	  .map(() => THREE.MathUtils.randFloatSpread(100));
  
	star.position.set(x, y, z);
	scene.add(star);
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

	gltfLoader.load('./public/models/Keyboard_Rotate.glb', function ( gltf) {
		keyboard = gltf.scene;
		const modelMaterial = new THREE.MeshPhongMaterial({
			color: 0x1f1f1f
		});
		keyboard.traverse((o) => {
			if(o.isMesh) {
				o.material = modelMaterial;
			}
		})

		keyboard.position.set(11.8,7.5,6);

		sc.add(keyboard);
	});

	const trackPoints = [
		new THREE.Vector3(1.8, 2.4, 0),
		new THREE.Vector3(4, 4, 0),
		new THREE.Vector3(8, 8, 0)
	];

	const lookatPoints = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(2, 2, 1.5),
		new THREE.Vector3(4, 4, 3),
		new THREE.Vector3(6, 6, 4.5),
		new THREE.Vector3(8, 8, 6)
	];

	cameraTrack = new THREE.CatmullRomCurve3(trackPoints);
	cameralookat = new THREE.CatmullRomCurve3(lookatPoints);

	const pathGeometry = new THREE.BufferGeometry().setFromPoints(cameraTrack.getPoints(50));
	const pathMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
	const pathObject = new THREE.Line(pathGeometry, pathMaterial);
	//scene.add(pathObject);
	const pathGeometry2 = new THREE.BufferGeometry().setFromPoints(cameralookat.getPoints(50));
	const pathObject2 = new THREE.Line(pathGeometry2, pathMaterial);
	//scene.add(pathObject2);

	camera.position.copy(cameraTrack.getPointAt(0));
}

window.addEventListener("wheel", onMouseWheel);

function onMouseWheel(event) {

	pathPos += event.deltaY / 1000;
	console.log(pathPos);

	camera.position.copy(cameraTrack.getPointAt(pathPos));
	camera.lookAt(cameralookat.getPointAt(pathPos));
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
	renderer.setSize(window.innerWidth, window.innerHeight);

	keyboard.rotation.y += 0.01;

	renderer.render(scene, camera);
}


main();
update();