var scene;
var camera;
var renderer;
var controls;

var ambientLight;
var directionalLight;

var geometry;
var material;

var container;
var mesh;
var wireframe;

var simplex = new SimplexNoise();

var grid = {
    minX: -10,
    minY: -5,
    minZ: -10,
    maxX: 10,
    maxY: 5,
    maxZ: 10,
    numCellsX: 100,
    numCellsY: 50,
    numCellsZ: 100,
};

function density(x, y, z) {
//    if ((x < grid.minX + 0.0001) ||
//        (y < grid.minY + 0.0001) ||
//        (z < grid.minZ + 0.0001) ||
//        (x > grid.maxX - 0.0001) ||
//        (y > grid.maxY - 0.0001) ||
//        (z > grid.maxZ - 0.0001)) {
//        return -10000;
//    }
    
//    x += simplex.noise3D(x * 0.5, y * 0.5, z * 0.5) * 0.5;
//    y += simplex.noise3D(x * 0.5 + 100, y * 0.5 + 100, z * 0.5 + 100) * 0.5;
//    z += simplex.noise3D(x * 0.5 + 200, y * 0.5 + 200, z * 0.5 + 200) * 0.5;
    x += simplex.noise3D(x * 0.25, y * 0.25, z * 0.25);
    y += simplex.noise3D(x * 0.25 + 100, y * 0.25 + 100, z * 0.25 + 100);
    z += simplex.noise3D(x * 0.25 + 200, y * 0.25 + 200, z * 0.25 + 200);
//    x += simplex.noise3D(x * 0.1, y * 0.1, z * 0.1) * 2;
//    y += simplex.noise3D(x * 0.1 + 100, y * 0.1 + 100, z * 0.1 + 100) * 2;
//    z += simplex.noise3D(x * 0.1 + 200, y * 0.1 + 200, z * 0.1 + 200) * 2;
    return -y +
        simplex.noise3D(x * 0.1, y * 0.1, z * 0.1) * 3 +
        simplex.noise3D(x * 0.25, y * 0.25, z * 0.25) * 1.5 +
        simplex.noise3D(x * 1, y * 1, z * 1) * 1 +
        simplex.noise3D(x * 4, y * 4, z * 4) * 0.1;
//    return -(x * x + y * y + z * z) + 4;
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.zoomSpeed = 0.5;
    
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);
    
    container = new THREE.Object3D();

    geometry = new THREE.BufferGeometry();
    var vertexData = marchingCubes(density, grid);
    var buf = new THREE.InterleavedBuffer(vertexData, 6);
    geometry.addAttribute('position', new THREE.InterleavedBufferAttribute(buf, 3, 0));
    geometry.addAttribute('normal', new THREE.InterleavedBufferAttribute(buf, 3, 3));
    
    material = new THREE.MeshLambertMaterial(
    {
        color: 0x00c000,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
    });
    mesh = new THREE.Mesh(geometry, material);
    container.add(mesh);
    
    var wireframeMaterial = new THREE.LineBasicMaterial(
    {
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
    });
    container.add(new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireframeMaterial));

    scene.add(container);
    
    camera.position.y = 5;
    camera.position.z = 10;
}

function animate() {
    requestAnimationFrame(animate);

//    container.rotation.y += -0.005;

    renderer.render(scene, camera);
};

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
