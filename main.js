import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let cubeRotation = 0;
let phoenix;

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-1, 1, 5);

const camPos = camera.position;
const target = new THREE.Vector3(-1, 1.5, -2);
camera.lookAt(target);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

//screen size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Add ambient light to the scene
var ambientLight = new THREE.AmbientLight(0x404040, 100); // Specify the color of the ambient light
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Color, Intensity
directionalLight.position.set(1, 1, 1); // Direction of the light
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight(0xffffff, 1); // Color, Intensity
directionalLight2.position.set(-1, -1, -1); // Direction of the light
scene.add(directionalLight2);

const loader = new GLTFLoader();

let model;
let mixer;

loader.load("./public/phoe.glb", (gltf) => {
  model = gltf.scene;
  phoenix = model;
  phoenix.scale.set(0.3, 0.3, 0.3);
  scene.add(phoenix);

  mixer = new THREE.AnimationMixer(model);
  const animations = gltf.animations;

  //   gltf.animations.forEach((clip) => {
  //   mixer.clipAction(clip).play();
  // });

  if (animations.length >= 3) {
    const thirdAnimationClip = animations[4];
    const action = mixer.clipAction(thirdAnimationClip);
    action.play();
  }
});

const camPositions = {
  section1: { x: -5, y: 0, z: 0 },
  section2: { x: 7.3, y: -8.9, z: 5.7 },
  section3: { x: 0, y: 2, z: 0 },
};
const camTargets = {
  section1: { x: 0, y: 2, z: 2.5 },
  section2: { x: -0.37, y: -0.9, z: 0.8 },
  section3: { x: 0, y: 2, z: 0 },
};

function setupScrollAnim() {
  ScrollTrigger.defaults({
    immediateRender: false,
    ease: "power1.inOut",
    scrub: true,
    // markers: true,
  });

  const tl = gsap.timeline();
  // target.set(0, 0, 0);

  //
  tl.to(camPos, {
    // x:-8.9,y:-.21,z:2.1,
    x: camPositions.section1.x,
    y: camPositions.section1.y,
    z: camPositions.section1.z,
    scrollTrigger: {
      trigger: ".second",
      start: "top bottom",
      end: "top top",
      // markers:true,
      // scrub:2
    },
  })

    .to(target, {
      // x:-.6,y:1,z:1.1,
      x: camTargets.section1.x,
      y: camTargets.section1.y,
      z: camTargets.section1.z,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        // markers:true,
        // scrub:2
      },
    })

    .to(camPos, {
      x: 3.3,
      y: -0.9,
      z: 0.7,
      scrollTrigger: {
        trigger: ".third",
        start: "top bottom",
        end: "top top",
        // markers:true,
        // scrub:2
      },
    })

    .to(target, {
      x: -0.37,
      y: 0.9,
      z: 0.8,
      scrollTrigger: {
        trigger: ".third",
        start: "top bottom",
        end: "top top",
        // markers:true,
        // scrub:2
      },
    })

    .to(camPos, {
      x: 0.17,
      y: -1.8,
      z: -3.14,
      scrollTrigger: {
        trigger: ".fourth",
        start: "top bottom",
        end: "top top",
        // markers:true,
        // scrub:2
      },
    })

    .to(target, {
      x: 1,
      y: -1,
      z: -0,
      scrollTrigger: {
        trigger: ".fourth",
        start: "top bottom",
        end: "top top",
        // markers:true,
        // scrub:2
      },
    });
}

setupScrollAnim();

// Event listener for the scroll event
window.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  // Calculate the mouse's position in normalized device coordinates
  const mouseX = (event.clientX / sizes.width) * 2 - 1;
  const mouseY = (event.clientY / sizes.height) * 2 - 1;

  // Set the model's rotation based on the cursor's position
  cubeRotation = {
    x: mouseY * Math.PI, // Adjust the rotation factor as needed
    y: mouseX * Math.PI, // Adjust the rotation factor as needed
    z: 0, // You can set this to a fixed value if you don't want rotation around the z-axis
  };
}

//resize
window.addEventListener("resize", () => {
  //update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

let clock = new THREE.Clock();

// Add animation
const animate = () => {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();
  // Update the cube's rotation
  // if(phoenix){
  //    phoenix.rotation.y = cubeRotation;
  // }

  if (mixer) {
    mixer.update(deltaTime / 2); // Adjust the time delta as needed.
  }

  if (phoenix) {
    // Rotate the model based on the cursor's position
    phoenix.rotation.set(
      cubeRotation.x / 50,
      cubeRotation.y / 50,
      cubeRotation.z / 50
    );
  }

  camera.lookAt(target);
  // console.log(target);

  // Render the scene
  renderer.render(scene, camera);
};

animate();
