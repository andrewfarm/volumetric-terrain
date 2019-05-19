var scene;
var camera;
var renderer;
var controls;

var light;

var geometry;
var material;
var cube;

var simplex = new SimplexNoise();

var grid = {
    minX: -5,
    minY: -2.5,
    minZ: -5,
    maxX: 5,
    maxY: 2.5,
    maxZ: 5,
    numCellsX: 100,
    numCellsY: 50,
    numCellsZ: 100,
};

function density(x, y, z) {
    return -y +
        simplex.noise3D(x * 0.25, y * 0.25, z * 0.25) * 1.5 +
        simplex.noise3D(x * 1, y * 1, z * 1) * 1 +
        simplex.noise3D(x * 4, y * 4, z * 4) * 0.1;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    light = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(light);

    geometry = new THREE.BufferGeometry();
    var vertexData = marchingCubes(density, grid);
    var buf = new THREE.InterleavedBuffer(vertexData, 6);
    geometry.addAttribute('position', new THREE.InterleavedBufferAttribute(buf, 3, 0));
    geometry.addAttribute('normal', new THREE.InterleavedBufferAttribute(buf, 3, 3));
    
    material = new THREE.MeshLambertMaterial({ color: 0x00c000 });
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
