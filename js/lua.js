import * as THREE from '../three/three.module.js';

var div = document.getElementById('lua');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 2000 ); 
var light2 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
var light = new THREE.PointLight( 0xff0000, 1, 100 );
var loader = new THREE.TextureLoader();



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
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 0.82,0.204,0.482, 1.0 ) * intensity;',
        '}'
      ].join('\n')
    }
  };



var shader, uniforms;


const settings = {
        metalness: 0.0,
        roughness: 0.5,
        aoMapIntensity: 1.0,
        displacementScale: 1.5, // from original model
        normalScale: 1.0
    };

// Setando o renderer e juntando ele a Div: lua
var renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance",
  alpha: true,
  })
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio *  0.5);

const getRandomParticelPos = (particleCount) => {
const arr = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    arr[i] = (Math.random() - 0.5) * 10;
}
return arr;
};
// mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
});

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
let mesh = new THREE.Mesh(geometry, materialGlow);
mesh.scale.set( 1.2, 1.1, 1.2 );
mesh.position.set(53.2,0,-30)
scene.add(mesh);
// Geometry
const geometrys = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

geometrys[0].setAttribute(
"position",
new THREE.BufferAttribute(getRandomParticelPos(350), 3)
);
geometrys[1].setAttribute(
"position",
new THREE.BufferAttribute(getRandomParticelPos(1500), 3)
);

// material
const materials = [
new THREE.PointsMaterial({
size: 2,
map: loader.load("../three/particles/particle-img/sp1.png"),
transparent: true
// color: "#ff0000"
}),
new THREE.PointsMaterial({
size: 1,
map: loader.load("../three/particles/particle-img/sp2.png"),
transparent: true
// color: "#0000ff"
})
];

const starsT1 = new THREE.Points(geometrys[0], materials[0]);
const starsT2 = new THREE.Points(geometrys[1], materials[1]);
starsT1.scale.set(20,20,10);
starsT2.scale.set(20,20,10);
starsT1.position.z = -70;
starsT2.position.z = -70;
scene.add(starsT1);
scene.add(starsT2);
// Carregando Texturas
const textureLoader = new THREE.TextureLoader();
const colorMap = textureLoader.load('../three/textura/lua/color-nova.png') 
const normalMap = textureLoader.load( '../three/textura/lua/lua_Normal.png' );
const aoMap = textureLoader.load( '../three/textura/lua/lua_AO.png' );
const displacementMap = textureLoader.load( '../three/textura/lua/Displace.jpeg' );




const material = new THREE.MeshStandardMaterial( {

    map: colorMap,

    color: 0x888888,
    roughness: settings.roughness,
    metalness: settings.metalness,

    normalMap: normalMap,
    normalScale: new THREE.Vector2( 3, - 1 ), // why does the normal map require negation in this case?

    aoMap: aoMap,
    aoMapIntensity: 0,

    displacementMap: displacementMap,
    displacementScale: settings.displacementScale,
    displacementBias: - 1.0, // from original model

    side: THREE.DoubleSide

} );

// Fundindo geometria e materiam em uma Mesh
const lua = new THREE.Mesh( geometry, material );

// Adicionando a mesh e luz na cena
scene.add( lua );
scene.add( light );
scene.add( light2 );

light.position.set( 0, 0, 0 );
// Ajuste de posição da camera e da mesh
lua.position.x = 50;
lua.position.y = 0;
lua.position.z = -30
camera.position.z = 100;
camera.position.x = 0
camera.position.y = 0

div.appendChild( renderer.domElement );

// Função que anima a mesh
function animate() {
    requestAnimationFrame( animate );

    lua.rotation.y -= 0.003;
    starsT1.position.x = mouseX * -0.0005;
    starsT1.position.y = mouseY * 0.0005;

    starsT2.position.x = mouseX * 0.0005;
    starsT2.position.y = mouseY * -0.0005;
    renderer.render( scene, camera );
};

animate();