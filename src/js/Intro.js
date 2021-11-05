import gsap from 'gsap'

class Intro{
  constructor({ startFunc }) {
    Object.assign(this, { startFunc })

    this.container = document.querySelector('.intro')

    this.initInput()
    this.initButton()
  }

  initInput() {
    this.inputDate = document.querySelector('#date')

    const dateToday = new Date()
    const day = dateToday.getDay().toString().padStart(2, '0')
    const month = dateToday.getMonth()
    const year = dateToday.getFullYear()
    const todayText = `${year}-${month}-${day}`

    this.inputDate.value = `${year - 20}-${month}-${day}`
    this.inputDate.max = todayText
    this.inputDate.min = `${year - 100}-${month}-${day}`
  }

  initButton() {
    this.buton = document.querySelector('#start')

    this.buton.addEventListener('click', () => {
      this.buton.textContent = 'Loading ...'

      const date = new Date(this.inputDate.value)
      const seed = date.getTime()
      const age = new Date().getFullYear() - date.getFullYear()

      setTimeout(() => {
        this.startFunc.call(undefined, seed, age)
      }, 100);
    })
  }

  hide() {
    gsap.to(
      this.container,
      {
        opacity: 0,
        onStart: () => {
          this.container.style.pointerEvents = 'none'
        }
      }
    )
  }
}

export default Intro
