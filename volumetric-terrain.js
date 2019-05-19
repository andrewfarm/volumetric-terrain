var scene;
var camera;
var renderer;
var controls;

var geometry;
var material;
var cube;

var simplex = new SimplexNoise();

var grid = {
    minX: -5,
    minY: -5,
    minZ: -5,
    maxX: 5,
    maxY: 5,
    maxZ: 5,
    numCellsX: 10,
    numCellsY: 10,
    numCellsZ: 10,
};

function density(x, y, z) {
    return -y;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    geometry = new THREE.BufferGeometry();
    var vertexData = marchingCubes(density, grid);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertexData, 3));
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 10;
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.y += -0.005;

    renderer.render(scene, camera);
};

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
