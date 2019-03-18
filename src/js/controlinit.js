/*
 * @desc 控制面板初始化代码
 * 注：控制面板自定义代码
 */

import dat from '@o2team/ambient-dat.gui'
import {
  O2_AMBIENT_MAIN, O2_AMBIENT_CONFIG
} from './utils/const'
import Controller from './utils/controller'
import { getParameterByName, getRandom, getRandomArr } from './utils/util'

/* eslint-disable no-unused-vars */
const isLoop = getParameterByName('loop')

let controlInit = () => {
  // 非必要配置字段（仅用于展示，如背景颜色、启动/暂停）
  class OtherConfig {
    constructor () {
      this.message = '粒子呼吸'
      this.backgroundColor = '#ffffff'
      this.play = () => {
        if (!window[O2_AMBIENT_MAIN] || !window[O2_AMBIENT_MAIN].toggle || typeof window[O2_AMBIENT_MAIN].toggle !== 'function') return
        window[O2_AMBIENT_MAIN].toggle()
      }
    }
  }

  // 主控制面板
  class Control extends Controller {
    constructor () {
      super()
      this.otherConfig = new OtherConfig()
      this.controls = {}
      this.initBaseGUI()
      this.initAdvancedGUI()
      this.isShowController && !this.isAmbientPlat && this.setBackgroundColor(this.otherConfig.backgroundColor)
    }

    initBaseGUI () {
      const config = this.config
      const otherConfig = this.otherConfig
      const gui = new dat.GUI()
      gui.addCallbackFunc(this.resetCanvas.bind(this))
      config.random = () => {
        this.randomData()
      }
      this.isShowController && !this.isAmbientPlat && gui.addColor(otherConfig, 'backgroundColor').name('背景色(仅演示)').onFinishChange(val => {
        this.setBackgroundColor(val)
      })
      gui.add(otherConfig, 'message').name('配置面板')
      gui.add(otherConfig, 'play').name('播放 / 暂停')
      gui.add(config, 'random').name('随机配置')
      gui.add(config, 'Width').name('粒子散播宽度').onFinishChange(val => {
        window[O2_AMBIENT_MAIN].update(config)
      })
      gui.add(config, 'Height').name('粒子散播高度').onFinishChange(val => {
        window[O2_AMBIENT_MAIN].update(config)
      })
      this.controls['Color1'] = gui.addColor(config, 'Color1').name('粒子颜色1')
      this.controls['Color2'] = gui.addColor(config, 'Color2').name('粒子颜色2')
      this.controls['Speed'] = gui.add(config, 'Speed', 1, 10).name('粒子速度')
      this.controls['Shadow'] = gui.add(config, 'Shadow', 0, 0.8).name('阴影范围')
      this.controls['Spacing'] = gui.add(config, 'Spacing', 0, 200).name('粒子间距')
      this.controls['Points'] = gui.add(config, 'Points', 1, 30).step(1).name('粒子数量').onFinishChange(val => {
        window[O2_AMBIENT_MAIN].update(config)
      })
      this.controls['Emission'] = gui.add(config, 'Emission', 1, 20).name('辐射范围')
      this.controls['Repeate'] = gui.add(config, 'Repeate', 1, 20).name('密度')
      this.controls['maxSize'] = gui.add(config, 'maxSize', 10, 50).name('粒子最大尺寸')
      this.controls['minSize'] = gui.add(config, 'minSize', 0, 10).name('粒子最小尺寸')
      gui.add(config, 'Rotate').name('是否旋转')
      gui.add(config, 'time').step(1).name('运行时间（0为无限制）').onFinishChange(val => {
        window[O2_AMBIENT_MAIN].update(config)
      })
      this.gui = gui
      this.setGUIzIndex(2)
    }

    setGUIzIndex (zIndex) {
      this.gui.domElement.parentElement.style.zIndex = zIndex
    }

    initAdvancedGUI () {
      const gui = this.gui
      const config = this.config
      const shapeFolder = gui.addFolder('粒子图案')
      this.controls['Shape'] = shapeFolder.add(config, 'Shape', ['Text', 'Circle', 'Rectangle', 'Line', 'Diamond']).name('粒子图案')
      shapeFolder.add(config, 'Text').name('粒子图案')
      shapeFolder.open()
      this.shapeFolder = shapeFolder
    }

    randomData() {
      const { controls } = this
      const Color1 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)]
      const Color2 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)]
      const Speed = getRandom(1, 10)
      const Shadow = getRandom(0, 0.8)
      const Points = getRandom(2, 10)
      const Spacing = getRandom(0, 200)
      const Emission = getRandom(1, 20)
      const Repeate = getRandom(1, 20)
      const maxSize = getRandom(10, 30)
      const minSize = getRandom(0, 10)
      const Shape = getRandomArr(['Text', 'Circle', 'Rectangle', 'Line', 'Diamond'])

      // color1
      const color1 = this.rgbToHex(Math.floor(Color1[0]), Math.floor(Color1[1]), Math.floor(Color1[2]))
      controls['Color1'].setValue(color1)

      //color2
      const color2 = this.rgbToHex(Math.floor(Color2[0]), Math.floor(Color2[1]), Math.floor(Color2[2]))
      controls['Color2'].setValue(color2)

      controls['Speed'].setValue(Speed)
      controls['Points'].setValue(Points)
      controls['Shadow'].setValue(Shadow)
      controls['Spacing'].setValue(Spacing)
      controls['Emission'].setValue(Emission)
      controls['Repeate'].setValue(Repeate)
      controls['maxSize'].setValue(maxSize)
      controls['minSize'].setValue(minSize)
      controls['Shape'].setValue(Shape)
    }

    componentToHex(c) {
      const hex = c.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }

    rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
    }
  }

  /* eslint-disable no-new */
  new Control()
}

export default controlInit
