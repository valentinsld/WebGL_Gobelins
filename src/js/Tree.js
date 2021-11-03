import * as THREE from 'three'

const MATERIAL = new THREE.MeshNormalMaterial()
class Tree {
  constructor({ scene }) {
    Object.assign(this, { scene })

    console.log('init')
    this.newBranch(0, 0, 5, 20)
  }

  newBranch(x, y, width, height,) {
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
    const angle = Math.PI / 2 * (Math.random() - 0.5)
    parent.rotation.z = angle
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

    this.newBranch(posX, posY, nextWidth, height * 0.67)
  }

  //
  // UPDATE
  //
  update() {

  }
}

export default Tree
