import * as THREE from 'three'
// eslint-disable-next-line import/extensions
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import SimplexNoise from 'simplex-noise'
import Tree from './Tree'

import Intro from './Intro'

function easeInQuad(x) {
  if (x > 1) return x
  return x * x;
}

class App {
  constructor() {
    // Debug
    // this.gui = new dat.GUI({ width: 340 })
    this.debug = window.location.hash === '#DEBUG'

    // Canvas
    this.canvas = document.querySelector('canvas.webgl')

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.resize()

    this.initAxis()
    this.initLight()
    this.initMap()
    this.initIntro()

    this.clock = new THREE.Clock()
    this.initEvents()
  }

  //
  // Init World
  //
  initScene() {
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog('#fff', 300, 400)
  }

  initCamera() {
    // Base camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
    this.camera.position.set(50, 20, 0)
    this.camera.lookAt(0, 30, 0)
    this.scene.add(this.camera)

    this.animationCamera = false

    // Controls
    // this.controls = new OrbitControls(this.camera, this.canvas)
    // this.controls.target = new THREE.Vector3(0, 40, 0);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0xffffff)
  }

  //
  // INIT MAP
  //
  initAxis() {
    if (this.debug) {
      const axisHelper = new THREE.AxesHelper(10)
      this.scene.add(axisHelper)
    }
  }
  initLight() {
    var light0 = new THREE.DirectionalLight(0xffffff, 1.0)
    light0.position.set(40, 70, 40)
    light0.castShadow = true
    light0.shadow.camera.fov = 120
    light0.shadow.camera.near = 10
    light0.shadow.camera.far = 200
    light0.shadow.camera.top = 90
    light0.shadow.camera.bottom = -20
    light0.shadow.camera.left = -60
    light0.shadow.camera.right = 60
    light0.shadow.mapSize.width = light0.shadow.mapSize.height = 2048
    this.scene.add(light0)

    // const helper = new THREE.DirectionalLightHelper(light0)
    // this.scene.add(helper)
    // const helperCamera = new THREE.CameraHelper(light0.shadow.camera)
    // this.scene.add(helperCamera)

    this.light = light0

    var light1 = new THREE.DirectionalLight(0xffffff, 0.5)
    light1.position.set(-1, 1, -1)
    this.scene.add(light1)

    var ambientLight = new THREE.AmbientLight(0x404040)
    this.scene.add(ambientLight)
  }

  initMap() {
    var size = 40;

    var floor = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10, 10, 16, 16),
        new THREE.MeshPhongMaterial({
            side : THREE.DoubleSide,
            color : 0xbbbbbb,
            shininess : 40,
            shading : THREE.FlatShading
        })
    );

    // add shader to plane
    const simplex = new SimplexNoise()
    const positions = floor.geometry.attributes.position
    
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * positions.itemSize
      const posX = positions.array[i3];
      const posZ = positions.array[i3 + 1];
      
      const noise = simplex.noise2D(posX, posZ)
      positions.array[i3 + 2] += noise * 0.05 + 0.05
    }
    console.log(floor)
    floor.updateMatrix();


    floor.position.set(0, 0.1, 0)
    floor.scale.set(size, size, size)
    floor.rotation.set(- Math.PI * 0.5, 0, 0)
    floor.receiveShadow = true
    this.scene.add(floor)
  }

  initIntro() {
    this.intro = new Intro({
      startFunc: this.initTree.bind(this)
    })
  }

  initTree(seed, age) {
    this.tree = new Tree({
      scene: this.scene,
      seed,
      age,
      endFunc: this.endGeneration.bind(this)
    })
  }

  endGeneration() {
    this.intro.hide(this.tree.animation.bind(this.tree))

    this.animationCamera = this.clock.getElapsedTime()
  }


  //
  // Events
  //
  initEvents() {
    window.addEventListener('resize', this.resize.bind(this))

    this.update()
  }

  resize() {
    // Update sizes
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
  }

  //
  // Update
  //
  update() {
    window.requestAnimationFrame(this.update.bind(this))

    const elapsedTime = this.clock.getElapsedTime()

    // Update controls
    // this.controls.update()

    if (this.animationCamera) {
      let elapsedTimeBis = elapsedTime - this.animationCamera
      elapsedTimeBis = easeInQuad(elapsedTimeBis) 

      const multiplier = (1 + this.tree.ageFloat)
      const r = Math.min(50 + elapsedTimeBis * 0.5, 60) * multiplier
      const x = 0 + Math.cos(elapsedTimeBis) * r
      const z = 0 + Math.sin(elapsedTimeBis) * r
      const y = 20 + elapsedTimeBis * 2 * multiplier
      this.camera.position.set(x, Math.min(y, 60 * multiplier) , z)
      this.camera.lookAt(0, 30, 0)
    }

    // Render
    this.renderer.render(this.scene, this.camera)
  }
}

export default App
