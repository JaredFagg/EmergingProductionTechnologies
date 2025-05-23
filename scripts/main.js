// Test
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let controls;
let scene;
let camera;
let renderer;

let InteractableKeyboard;
let isKeyboardAnimate = true;
let mouse = false;
let mouseX;
let mouseY;
let selectedObject;

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

	//helper(scene, camera, renderer);
	modifyScene(scene, camera);
	createScene(scene);
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

	gltfLoader.load('./public/models/Keyboard_Rotate.glb', function ( gltf) {
		InteractableKeyboard = gltf.scene;
		const modelMaterial = new THREE.MeshPhongMaterial({
			color: 0x1f1f1f
		});
		InteractableKeyboard.traverse((o) => {
			if(o.isMesh) {
				o.material = modelMaterial;
				o.name = "InteractableKeyboard";
			}
		})

		InteractableKeyboard.name = "InteractableKeyboard";
		sc.add(InteractableKeyboard);
	});

	const trackPoints = [
		new THREE.Vector3(1.8, 2.4, 0),
		new THREE.Vector3(4, 4, 0),
		new THREE.Vector3(8, 8, 0),
		new THREE.Vector3(16, 8, 0)
	];

	const lookatPoints = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 8, 0)
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

document.addEventListener('mousemove', trackPosition);

function trackPosition(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

const raycaster = new THREE.Raycaster();

document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event) {

	mouse = true;

	const coords = new THREE.Vector2(
		(event.clientX / renderer.domElement.clientWidth) * 2 - 1,
		-((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
	);

	raycaster.setFromCamera(coords, camera);

	const intersections = raycaster.intersectObjects(scene.children, true);
	if (intersections.length > 0) {
		selectedObject = intersections[0].object;

		console.log(selectedObject);
	}
}

document.addEventListener('mouseup', onmouseup);

function onmouseup(event) {
	mouse = false
}

function animateKeyboard() {
	if(InteractableKeyboard == null) {

	} else {
		if(isKeyboardAnimate) {
			InteractableKeyboard.rotation.y += 0.01;
		} else {
			InteractableKeyboard.rotation.set(0, 
				InteractableKeyboard.rotation.y, 
				0);
		}

		if(selectedObject == null) {

		} else {
			if(mouse && selectedObject.name == "InteractableKeyboard") {
				isKeyboardAnimate = false;
				if(isKeyboardAnimate == false) {
					InteractableKeyboard.rotation.set(InteractableKeyboard.rotation.x,
						mouseX / 100,
						InteractableKeyboard.rotation.z);
				}
	
			} else {
				isKeyboardAnimate = true;
				selectedObject = null;
			}
		}


		InteractableKeyboard.position.set(3, 5, window.innerWidth / 440);
	}
}

function helper(sc, c, r) {
	// Creates a grid and camera system to orbit and pan during development
	const gridHelper = new THREE.GridHelper(200, 50);
	sc.add(gridHelper);
	controls = new OrbitControls(c, r.domElement);
} 

function assignSettings() {
	camera.aspect =  window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
	requestAnimationFrame(update);

	animateKeyboard();

	pathPos = window.scrollY / (window.innerHeight * 2);
	camera.position.copy(cameraTrack.getPointAt(pathPos));
	camera.lookAt(cameralookat.getPointAt(pathPos));

	//controls.update();
	assignSettings();

	renderer.render(scene, camera);
}

main();
update();

