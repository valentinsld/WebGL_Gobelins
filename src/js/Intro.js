import gsap from 'gsap'

class Intro{
  constructor({ startFunc }) {
    Object.assign(this, { startFunc })

    this.container = document.querySelector('.intro')
    this.infoContainer = document.querySelector('.info')

    this.initInput()
    this.initButton()
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
