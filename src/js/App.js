import * as THREE from 'three'
// eslint-disable-next-line import/extensions
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import Tree from './Tree'

class App {
  constructor() {
    // Debug
    this.gui = new dat.GUI({ width: 340 })
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
    this.initAmbientLight()
    this.initTree()

    this.clock = new THREE.Clock()
    this.initEvents()
  }

  //
  // Init World
  //
  initScene() {
    this.scene = new THREE.Scene()
    // this.scene.fog = new THREE.Fog('black', 0.1, 60)
  }

  initCamera() {
    // Base camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
    this.camera.position.set(0, 40, 40)
    this.scene.add(this.camera)

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.target = new THREE.Vector3(0, 20, 0);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  //
  // INIT MAP
  //
  initAxis() {
    console.log(this.debug)
    if (this.debug) {
      const axisHelper = new THREE.AxesHelper(10)
      this.scene.add(axisHelper)
    }
  }
  initAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1)
    this.scene.add(this.ambientLight)
  }

  initTree() {
    this.tree = new Tree({
      scene: this.scene
    })
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
  }

  //
  // Update
  //
  update() {
    window.requestAnimationFrame(this.update.bind(this))

    const elapsedTime = this.clock.getElapsedTime()

    // Update controls
    this.controls.update()

    this.tree.update(elapsedTime)

    // Render
    this.renderer.render(this.scene, this.camera)
  }
}

export default App
