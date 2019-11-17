const shaderMat = new THREE.ShaderMaterial({
  vertexShader: `
#include <fog_pars_vertex>

void main(void) {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,
  fragmentShader: `
uniform vec3 color;

#include <fog_pars_fragment>

void main(void) {
  gl_FragColor = vec4(color, 1.0);
  #include <fog_fragment>
}
`,
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      color: { value: new THREE.Color(0xff0000) },
    }
  ]),
  fog: true,
});

const basicMat = new THREE.MeshBasicMaterial({color: new THREE.Color(0xff0000)});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const fog = new THREE.Fog(0x000000, 0, 10);
const fogExp2 = new THREE.FogExp2(0x000000, 0.2);
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 0, 10);

const sphereGeom = new THREE.SphereBufferGeometry(); 
for (let i = -2.0; i <= 2.0; i++) {
  const sphere = new THREE.Mesh(sphereGeom, shaderMat);
  sphere.position.x = 2.0 * i;
  sphere.position.z = 1.5;
  scene.add(sphere);
}
for (let i = -2.0; i <= 2.0; i++) {
  const sphere = new THREE.Mesh(sphereGeom, basicMat);
  sphere.position.x = 2.0 * i;
  sphere.position.z = -1.5;
  scene.add(sphere);
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(6, 3, 0);
camera.lookAt(new THREE.Vector3(2, 0, 0));

const parameters = {
  'fog type': 'fog',
}

const gui = new dat.GUI();
gui.add(parameters, 'fog type', ['fog', 'fogExp2', 'none']).onChange((v) => {
  if (v === 'fog') {
    scene.fog = fog;
  } else if (v === 'fogExp2') {
    scene.fog = fogExp2;
  } else {
    scene.fog = null;
  }
});

addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
