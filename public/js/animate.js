require("three")

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, $("#model-div").innerWidth() / $("#model-div").innerHeight(), 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize($("#model-div").innerWidth(), $("#model-div").innerHeight());

document.getElementById("model-div").appendChild(renderer.domElement);

loader.load('path/to/model.glb', function (gltf) {

    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

