"use strict";
import * as THREE from '../three/build/three.module.js';
import { GLTFLoader } from '../three/loaders/GLTFLoader.js';
import { EffectComposer } from '../three/postprocessing/EffectComposer.js';



var div = document.getElementById('amy');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );

// Ajuste de posição da camera e da mesh
camera.position.z = 1200;
camera.position.x = 0
camera.position.y = 350

let mixer
let effectSobel
var action
let mesh
// Luz
var light3 = new THREE.DirectionalLight( 0xFEF3E8, 0.5,  100);
var light2 = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
var light = new THREE.PointLight( 0x624780, 1.5, 1000 );

// Ajustando luz
light.position.set( -300, 200, -200);
light3.target.position.set(-50, 0, 0)
light3.position.set(10, 5, 10)
light3.castShadow = true

var clock = new THREE.Clock();

var Shaders = {
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 0.5 ) ), 12.0 );',
          'gl_FragColor = vec4( 4,222,133,1 ) * intensity;',
        '}'
      ].join('\n')
    }
  };



var shader, uniforms;

// Geometria e Material
const geometry = new THREE.SphereGeometry(20, 20, 1500);

shader = Shaders['atmosphere'];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    let materialGlow = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true

        });
mesh = new THREE.Mesh(geometry, materialGlow);
mesh.scale.set( 15, 15, 15 );
mesh.position.set(370,350,-100)
scene.add(mesh);


// Setando o renderer e juntando ele a Div: lua

var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
})
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio *  0.5);

div.appendChild( renderer.domElement );

// GLTF loader
var loader = new GLTFLoader();


// const glitchPass = new GlitchPass();
// composer.addPass( glitchPass );
// const bloomPass = new BloomPass();
// composer.addPass( bloomPass );


const element = document.querySelector('#amy');
element.style.setProperty('--animate-duration', '0.5s');

// Carregando modelo
loader.load(
// Caminho pro arquivo
'../three/models/nico/scene.gltf',

    // Função chamada quando o arquivo é carregado
    function ( gltf ) { 

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; 

        // Empurrando objeto para variavel
        let object = gltf.scene
        object.scale.set(500,500,500);
        object.name = 'amy';
        object.rotation.y = 0
        object.castShadow = true
        object.receiveShadow = false;
        object.frustumCulled = false
        console.log(object)
        // Adicionando objeto a cena

        mixer = new THREE.AnimationMixer( object );
        action = mixer.clipAction( gltf.animations[ 0 ] );
        action.setDuration( 10 )
        action.play();
    
        mixer.addEventListener( 'loop', function( e ) {
                action.crossFadeFrom(action,2)
                action.crossFadeTo(action,2)
   
        } )
    
        if (window.innerWidth < 568) {
          object.position.set(0, -350, 150);
          mesh.position.set(0, 0, 0);
          renderer.setPixelRatio( window.devicePixelRatio *  0.4);
        } else {
          object.position.set(-300, -350, 150);
        }

        // Futura att

        // object.traverse( function ( child ) {
        // 	if ( child instanceof THREE.Object3D  ) {
        // //		console.log(child.name +"test")
        // 	if(child.name=='embalagem-img'){
        //         alert("sim")
        // 		console.log(child)
        // 	//	child.material.color.setHex(0xffff00);
        // 	}
        // 	}
        // } );

        scene.add(object)

    },
    // Função de carregamento
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );


    },
    // Função em caso de erro
    function ( error ) {

        console.log( 'An error happened' );
        console.log(error)
    },
);
    

// Adicionando a mesh e luz na cena
scene.add(light);
scene.add(light2);
scene.add(light3);

// Pós process
const composer = new EffectComposer( renderer );
// const renderPass = new RenderPass( scene, camera );
// composer.addPass( renderPass );

// const effectGrayScale = new ShaderPass( LuminosityShader );
// composer.addPass( effectGrayScale );

// you might want to use a gaussian blur filter before
// the next pass to improve the result of the Sobel operator

// Sobel operator

// effectSobel = new ShaderPass( SobelOperatorShader );
// effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
// effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
// composer.addPass( effectSobel );  

setTimeout(function(){
    console.log("Scene polycount:", renderer.info.render.triangles)
    console.log("Active Drawcalls:", renderer.info.render.calls)
    console.log("Textures in Memory", renderer.info.memory.textures)
    console.log("Geometries in Memory", renderer.info.memory.geometries)
}, 30000); 
// Função que anima a mesh


function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    if (mixer) mixer.update( delta );
  
    mesh.rotation.y -= 0.005;
    // console.log(animationTime)
    renderer.render( scene, camera );
};

animate();
