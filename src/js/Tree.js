import * as THREE from 'three'
import Seed from './Seed'

const MATERIAL = new THREE.MeshNormalMaterial()
const MIN_DIFFERENCE_ANGLE = Math.PI*0.2
const WIDTH = 6
const HEIGHT = 24
const MAX_LEVEL = 6
class Tree {
  constructor({ scene }) {
    Object.assign(this, { scene })

    this.seed = new Seed(2)

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

  newBranch({ pos, width, height, angle, rotationY, parentContainer, level = 0 }) {
    const isLastBranch = level >= MAX_LEVEL
    const nextWidth = isLastBranch ? width * 0.3 : width * 0.67

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
      })
      this.newBranch({
        ...initParamsBranch,
        angle: angle2,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
      })
    } else {
      const angle1 = this.getRandomAngle() * 0.5
      const angle2 = Math.max(this.getRandomAngle(), angle1 + MIN_DIFFERENCE_ANGLE)
      const angle3 = Math.min(this.getRandomAngle(), angle1 - MIN_DIFFERENCE_ANGLE)

      this.newBranch({
        ...initParamsBranch,
        angle: angle1,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
      })
      this.newBranch({
        ...initParamsBranch,
        angle: angle2,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
      })
      this.newBranch({
        ...initParamsBranch,
        angle: angle3,
        rotationY: (this.seed.nextFloat() - 0.5) * Math.PI,
      })
    }
  }

  getRandomAngle() {
    const min = -Math.PI * 0.4
    const max = Math.PI * 0.4
    return this.seed.nextFloat() * (max - min) + min
  }

  //
  // UPDATE
  //
  update() {

  }
}

export default Tree
