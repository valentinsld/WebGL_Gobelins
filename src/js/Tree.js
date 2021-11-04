import * as THREE from 'three'
import Seed from './Seed'

const MATERIAL = new THREE.MeshNormalMaterial()
const MIN_DIFFERENCE_ANGLE = Math.PI*0.2
const WIDTH = 6
const HEIGHT = 24
class Tree {
  constructor({ scene }) {
    Object.assign(this, { scene })

    this.seed = new Seed(4)

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
      parentContainer: this.scene
    })
  }

  newBranch({ pos, width, height, angle, rotationY, parentContainer }) {
    const nextWidth = width * 0.67

    // init Mesh
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry( nextWidth, width, height, 16 ),
      MATERIAL
    )
    cylinder.position.y = height / 2, 0

    const parent = new THREE.Object3D()
    parent.add(cylinder)
    parent.position.set(pos.x, pos.y, 0)
    parent.rotation.z = angle
    parent.rotation.y = rotationY
    parentContainer.add(parent)


    if (width < 1) return

    // nextPOSITION :
    const positionNextBranch = {
      x: 0,
      y: height,
      z: 0
    }

    // sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(nextWidth, 16, 16),
      MATERIAL
    )
    sphere.position.set(positionNextBranch.x, positionNextBranch.y, 0)
    parent.add(sphere)

    // const branches = Math.floor(this.seed.nextFloat() * 3)
    const branches = 2

    if (branches === 0) return

    const rotateY = (this.seed.nextFloat() - 0.5) * Math.PI

    if (branches === 1) {
      // this.newBranch(posX, posY, 0, nextWidth, height * 0.67, Math.PI * (this.seed.nextFloat() - 0.5), rotateY, parent)
    } else if (branches === 2) {
      const angle1 = this.getRandomAngle()
      const angle2 = angle1 < 0 ? 
        Math.max(this.getRandomAngle(), angle1 + MIN_DIFFERENCE_ANGLE)
        : Math.min(this.getRandomAngle(), angle1 - MIN_DIFFERENCE_ANGLE)


      this.newBranch({
        pos: positionNextBranch,
        width: nextWidth,
        height: height * 0.67,
        angle: angle1,
        rotationY: rotateY,
        parentContainer: parent
      })
      this.newBranch({
        pos: positionNextBranch,
        width: nextWidth,
        height: height * 0.67,
        angle: angle2,
        rotationY: rotateY,
        parentContainer: parent
      })
    } else {

    }
  }

  getRandomAngle() {
    const min = -Math.PI * 0.25
    const max = Math.PI * 0.25
    return this.seed.nextFloat() * (max - min) + min
  }

  //
  // UPDATE
  //
  update() {

  }
}

export default Tree
