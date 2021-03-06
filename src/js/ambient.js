import './utils/raf'
import {
  O2_AMBIENT_INIT,
  O2_AMBIENT_CONFIG,
  O2_AMBIENT_MAIN
} from './utils/const'
import ParticlesEmission from './particles_emission'

// 判断是否可点，被点中则隐藏
let wrapper = document.querySelector('.o2team_ambient_main')
if (!wrapper) {
  wrapper = document.createElement('div')
  wrapper.setAttribute('class', 'o2team_ambient_main')
  wrapper.setAttribute('id', 'o2team_ambient_main')
  document.body.insertAdjacentElement('beforeend', wrapper)
}
wrapper.addEventListener('click', () => {
  wrapper.style.display = 'none'
})

// 初始化函数
export default function initAmbient () {
  const opts = window[O2_AMBIENT_CONFIG]
  const particlesEmision = new ParticlesEmission(opts)
  window[O2_AMBIENT_MAIN] = particlesEmision
}

// 初始化函数
window[O2_AMBIENT_INIT] = initAmbient
