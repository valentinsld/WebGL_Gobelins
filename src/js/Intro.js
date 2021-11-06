import gsap from 'gsap'
import { SplitText } from "./greensock/SplitText"
gsap.registerPlugin(SplitText)

class Intro{
  constructor({ startFunc }) {
    Object.assign(this, { startFunc })

    this.container = document.querySelector('.intro')
    this.infoContainer = document.querySelector('.info')

    this.initAnimation()

    this.initInput()
    this.initButton()
  }

  initAnimation() {
    console.log('aaa')
    const h1 = document.querySelector('h1')
    const lettersh1 = new SplitText(h1, { type:"lines,chars" }).chars

    const timeline = gsap.timeline()

    timeline
      .from(
        lettersh1,
        {
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          y: 22
        }
      )
      .from(
        document.querySelectorAll('.intro .introAnimated'),
        {
          opacity: 0,
          duration: 1.2,
          stagger: 0.25,
          ease: "power2.out",
          y: 20
        }
      )
  }

  initInput() {
    this.inputDate = document.querySelector('#date')

    const dateToday = new Date()
    const day = dateToday.getDay().toString().padStart(2, '0')
    const month = dateToday.getMonth().toString().padStart(2, '0')
    const year = dateToday.getFullYear()
    const todayText = `${year}-${month}-${day}`

    this.inputDate.value = `${year - 20}-${month}-${day}`
    this.inputDate.max = todayText
    this.inputDate.min = `${year - 100}-${month}-${day}`
  }

  initButton() {
    this.buton = document.querySelector('#start')

    this.buton.addEventListener('click', () => {
      const newText = 'Loading ...'
      this.buton.dataset.text = newText
      this.buton.querySelector('span').textContent = newText

      const date = new Date(this.inputDate.value)
      const seed = date.getTime()
      const age = this.getAge(this.inputDate.value)

      // set data
      document.querySelector('#infoDate').textContent = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDay().toString().padStart(2, '0')}`
      document.querySelector('#infoSeed').textContent = seed
      document.querySelector('#infoAge').textContent = age

      setTimeout(() => {
        this.startFunc.call(undefined, seed, age)
      }, 100);
    })
  }

  hide(func) {
    // hide intro
    gsap.to(
      this.container,
      {
        opacity: 0,
        onStart: () => {
          this.container.style.pointerEvents = 'none'
        },
        onComplete: () => {
          setTimeout(func, 100);
        }
      }
    )

    // show
    gsap.to(
      this.infoContainer,
      {
        opacity: 1,
        delay: 1.2,
        duration: 1.4,
      }
    )
  }

  //
  // helper get date
  //
  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
}

export default Intro
