import * as THREE from 'three'
import gsap from 'gsap'

import Seed from './Seed'

const MIN_DIFFERENCE_ANGLE = Math.PI*0.2
const WIDTH = 3.5
const HEIGHT = 26
const MAX_LEVEL = 4
class Tree {
  constructor({ scene }) {
    Object.assign(this, { scene })

    this.seed = new Seed(42)

    this.listBranches = [... new Array(MAX_LEVEL + 1)].map(() => [])
    
    this.initMaterial()
    this.initBranches()
    
    setTimeout(this.animation.bind(this), 1000);
  }

  initMaterial() {
    const treeMapTexture = new THREE.TextureLoader().load( 'textures/bark.png' );
    const treeNormalMap = new THREE.TextureLoader().load( 'textures/bark_normal.png' );
    const treeDisplacementMap = new THREE.TextureLoader().load( 'textures/bark_normal.png' );

    this.MATERIAL = new THREE.MeshPhongMaterial({
      shininess : 5,
      map: treeMapTexture,
      normalMap: treeNormalMap
    })
  }

  //
  // Branches
  //
  initBranches() {
    this.initTree = new THREE.Group()

    // this.newBranch(0, 0, 0, WIDTH, HEIGHT, 0, Math.PI * 0.5, this.scene)
    this.newBranch({
      pos: {
        x: 0,
        y: 0,
        z: 0,
      },
      width: WIDTH,
      height: HEIGHT,
      angle: 0,
      rotationY: Math.PI * 0.5,
      parentContainer: this.initTree
    })

    this.scene.add(this.initTree)
    console.log(this.scene)
  }

  newBranch({ pos, width, height, angle, rotationY, parentContainer, level = 0 }) {
    const isLastBranch = level >= MAX_LEVEL
    const nextWidth = isLastBranch ? width * 0.3 : width * 0.67

    // nextPOSITION :
    const positionNextBranch = { x: 0, y: height, z: 0 }

    // sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(nextWidth, 16, 16),
      this.MATERIAL
    )
    sphere.position.y = height / 2
    
    const cylinder = new THREE.CylinderGeometry( nextWidth, width, height, 16 )
    sphere.updateMatrix()
    cylinder.merge(sphere.geometry, sphere.matrix)

    const mesh = new THREE.Mesh(cylinder, this.MATERIAL)
    mesh.position.y = height / 2

    // parent
    const parent = new THREE.Object3D()
    parent.add(mesh);

    parent.position.set(pos.x, pos.y, 0)
    parent.rotation.z = angle
    parent.rotation.y = rotationY
    parent.scale.y = 0
    parentContainer.add(parent)

    this.listBranches[level].push({ mesh: parent, height })

    //
    // next branches
    //
    const branches = Math.round(1.5 +this.seed.nextFloat() * 2)

    if (isLastBranch) return

    const initParamsBranch = {
      pos: positionNextBranch,
      width: nextWidth,
      height: height * 0.75,
      rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
      parentContainer: parent,
      level: level + 1
    }

    if (branches === 1) {
      this.newBranch({
        ...initParamsBranch,
        angle: this.getRandomAngle(),
      })
    } else if (branches === 2) {
      const angle1 = this.getRandomAngle()
      const angle2 = angle1 < 0 ? 
        Math.max(this.getRandomAngle(), angle1 + MIN_DIFFERENCE_ANGLE)
        : Math.min(this.getRandomAngle(), angle1 - MIN_DIFFERENCE_ANGLE)


      this.newBranch({
        ...initParamsBranch,
        angle: angle1,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
        height: height * (this.seed.nextFloat() * (0.8 - 0.6) + 0.6)
      })
      this.newBranch({
        ...initParamsBranch,
        angle: angle2,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
        height: height * (this.seed.nextFloat() * (0.8 - 0.6) + 0.6)
      })
    } else {
      const angle1 = this.getRandomAngle() * 0.5
      const angle2 = Math.max(this.getRandomAngle(), angle1 + MIN_DIFFERENCE_ANGLE)
      const angle3 = Math.min(this.getRandomAngle(), angle1 - MIN_DIFFERENCE_ANGLE)

      this.newBranch({
        ...initParamsBranch,
        angle: angle1,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
        height: height * (this.seed.nextFloat() * (0.8 - 0.6) + 0.6)
      })
      this.newBranch({
        ...initParamsBranch,
        angle: angle2,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
        height: height * (this.seed.nextFloat() * (0.8 - 0.6) + 0.6)
      })
      this.newBranch({
        ...initParamsBranch,
        angle: angle3,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
        height: height * (this.seed.nextFloat() * (0.8 - 0.6) + 0.6)
      })
    }
  }

  getRandomAngle() {
    const min = -Math.PI * 0.4
    const max = Math.PI * 0.4
    return this.seed.nextFloat() * (max - min) + min
  }

  //
  // Update THREE
  //
  animation() {
    console.log()
    this.listBranches.map((list, index) => {
      list.map((el) => {
        gsap.to(
          el.mesh.scale,
          {
            y: 1,
            duration: 2.8 - el.height / HEIGHT * 2,
            ease: 'power2.out',
            delay: index / 2
          }
        )
      })
    })
  }

  //
  // UPDATE
  //
  update() {

  }
}

export default Tree
