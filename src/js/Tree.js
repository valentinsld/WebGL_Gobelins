import * as THREE from 'three'

const MATERIAL = new THREE.MeshNormalMaterial()
const MIN_DIFFERENCE_ANGLE = Math.PI*0.25
class Tree {
  constructor({ scene }) {
    Object.assign(this, { scene })

    console.log('init')
    this.newBranch(0, 0, 0, 5, 20, 0, Math.PI * 0.5)
  }

  newBranch(x, y, z, width, height, angle, rotationY) {
    const nextWidth = width * 0.67

    // init Mesh
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry( nextWidth, width, height, 16 ),
      MATERIAL
    )
    cylinder.position.y = height / 2, 0

    const parent = new THREE.Object3D()
    parent.add(cylinder)
    parent.position.set(x, y, 0)
    parent.rotation.z = angle
    parent.rotation.y = 0
    this.scene.add(parent)


    if (width < 1) return

    // POSITION :
    // x = x0 + r*cos(t)
    // y = y0 + r*sin(t)
    const posX = x + height * Math.cos(angle + Math.PI * .5)
    const posY = y + height * Math.sin(angle + Math.PI * .5)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(nextWidth, 16, 16),
      MATERIAL
    )
    sphere.position.set(posX, posY, 0)
    this.scene.add(sphere)

    // const branches = Math.floor(Math.random() * 3)
    const branches = 2

    if (branches === 0) return

    const rotateY =  rotationY

    if (branches === 1) {
      this.newBranch(posX, posY, 0, nextWidth, height * 0.67, Math.PI * (Math.random() - 0.5), rotateY)
    } else if (branches === 2) {
      const angle1 = Math.PI * (Math.random() - 0.5)
      const angle2 = angle1 < 0 ? 
        Math.min(Math.PI * 0.5 * Math.random(), angle1 + MIN_DIFFERENCE_ANGLE)
         : Math.max(Math.PI * -0.5 * Math.random(), angle1 - MIN_DIFFERENCE_ANGLE)

      this.newBranch(posX, posY, 0, nextWidth, height * 0.67, angle1, rotateY)
      this.newBranch(posX, posY, 0, nextWidth, height * 0.67, angle2, rotateY)
    } else {

    }

    // this.newBranch(posX, posY, nextWidth, height * 0.67, Math.PI * (Math.random() - 0.5))
  }

  //
  // UPDATE
  //
  update() {

  }
}

export default Tree
