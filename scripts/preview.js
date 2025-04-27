import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Establishes ThreeJS Canvas, Renderer, Camera & Scene.
const canvas = document.getElementById("PreviewCanvas");
const camera = new THREE.PerspectiveCamera( 75, document.getElementById("PreviewCanvas").clientWidth / document.getElementById("PreviewCanvas").clientHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
renderer.setAnimationLoop( animate );
const scene = new THREE.Scene();
scene.background = new THREE.Color().setRGB(255, 255, 255);

console.log(document.getElementById("PreviewCanvas").clientWidth + ' ' + document.getElementById("PreviewCanvas").clientHeight);

// Sets correct pixel density using resolution of computer monitor
renderer.setSize( document.getElementById("PreviewCanvas").clientWidth, document.getElementById("PreviewCanvas").clientHeight );
renderer.setPixelRatio(1.38 / 1);

const pointLight = new THREE.PointLight(0xffffff, 500, 100);
pointLight.position.set(6, 15, 15);
    
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const gltfLoader = new GLTFLoader();
gltfLoader.load('./public/models/Keyboard_Scene.glb', function ( gltf) {
    const model = gltf.scene;
    const sceneMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff
    });

    model.traverse((o) => {
        if(o.isMesh) {
            o.material = sceneMaterial;
        }
    })

    scene.add(model);
});

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
    scene.add(model);
});

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(1.8, 2.4, 0);
camera.lookAt(0, 0, 0);

function animate() {

    camera.aspect =  document.getElementById("PreviewCanvas").clientWidth / document.getElementById("PreviewCanvas").clientHeight;
	camera.updateProjectionMatrix();
    renderer.setSize( document.getElementById("PreviewCanvas").clientWidth, document.getElementById("PreviewCanvas").clientHeight );
    renderer.setPixelRatio(1.38 / 1);

    controls.update();
  
    renderer.render( scene, camera );
  
}