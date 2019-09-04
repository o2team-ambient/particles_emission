/*
 * @desc 控制面板初始化代码
 * 注：控制面板自定义代码
 */

import dat from '@o2team/ambient-dat.gui'
import {
  O2_AMBIENT_MAIN,
  O2_AMBIENT_CONFIG,
  O2_AMBIENT_CLASSNAME
} from './utils/const'
import Controller from './utils/controller'
import { getParameterByName, getRandom, getRandomArr } from './utils/util'
import processLocalConfig from './utils/processLocalConfig'

import configKeys from './configs/keys'

/* eslint-disable no-unused-vars */
const isLoop = getParameterByName('loop')
const configKeyVal = getParameterByName('configKey')
const configKey = configKeys[configKeyVal] || configKeys['default']

const loadData = {
  '默认': {
    '0': {...window[O2_AMBIENT_CONFIG]}
  }
}
const allLoadData = processLocalConfig({ configKey, guiName: O2_AMBIENT_CLASSNAME, loadData })

let controlInit = () => {
  // 非必要配置字段（仅用于展示，如背景颜色、启动/暂停）
  class OtherConfig {
    constructor () {
      this.backgroundColor = '#ffffff'
      this.play = () => {
        if (!window[O2_AMBIENT_MAIN] || !window[O2_AMBIENT_MAIN].toggle || typeof window[O2_AMBIENT_MAIN].toggle !== 'function') return
        window[O2_AMBIENT_MAIN].toggle()
      }
    }
  }

  // 主控制面板
  class Control extends Controller {
    sizeFolder
    colorFolder
    shapeFolder
    shapeText

    constructor () {
      super()
      this.otherConfig = new OtherConfig()
      this.otherConfig.random = () => {
        this.randomData()
      }
      this.controls = {}
      // this.controls = window[O2_AMBIENT_CONFIG]
      this.initBaseGUI()
      this.initShapeGUI()
      this.initColorGUI()
      this.initMotionGUI()
      this.initSizeGUI()
      this.initAdvancedGUI()
      this.isShowController && !this.isAmbientPlat && this.setBackgroundColor(this.otherConfig.backgroundColor)
    }

    initBaseGUI () {
      const config = this.config
      const otherConfig = this.otherConfig
      const gui = new dat.GUI({
        name: O2_AMBIENT_CLASSNAME,
        preset: configKey,
        load: {
          'remembered': { ...allLoadData.remembered }
        }
      })
      gui.remember(config)
      gui.addCallbackFunc(this.resetCanvas.bind(this))
      this.isShowController && !this.isAmbientPlat && gui.addColor(otherConfig, 'backgroundColor').name('背景色(仅演示)').onFinishChange(val => {
        this.setBackgroundColor(val)
      })
      gui.add(otherConfig, 'play').name('播放 / 暂停')
      gui.add(otherConfig, 'random').name('随机配置')
      this.gui = gui
      this.setGUIzIndex(2)
    }

    setGUIzIndex (zIndex) {
      this.gui.domElement.parentElement.style.zIndex = zIndex
    }

    initShapeGUI () {
      const gui = this.gui
      const config = this.config
      const shapeFolder = gui.addFolder('粒子图案')
      this.controls['Shape'] = shapeFolder
        .add(config, 'Shape', ['文字', '圆形', '方形', '线形', '钻石形'])
        .name('粒子图案')
        .onChange((val) => {
          this.resetCanvas()
          if (val === '文字' && !this.shapeText) {
            this.shapeText = this.shapeFolder.add(config, 'Text')
              .name('粒子图案')
              .onChange(this.resetCanvas.bind(this))
          }
          if (val !== '文字' && this.shapeText) {
            this.shapeFolder.remove(this.shapeText)
            this.shapeText = null
          }
        })
      // this.shapeText = shapeFolder
      //   .add(config, 'Text')
      //   .name('粒子图案')
      shapeFolder.open()
      this.shapeFolder = shapeFolder
    }

    initColorGUI () {
      this.colorFolder = this.gui.addFolder('粒子配色')
      this.controls['Color1'] = this.colorFolder.addColor(this.config, 'Color1').name('中心粒子色')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Color2'] = this.colorFolder.addColor(this.config, 'Color2').name('外围粒子色')
        .onChange(this.resetCanvas.bind(this))
      this.colorFolder.open()
    }

    initMotionGUI () {
      this.motionFolder = this.gui.addFolder('粒子动态')
      this.controls['Speed'] = this.motionFolder
        .add(this.config, 'Speed', 1, 10)
        .name('粒子速度')
        .onChange(this.resetCanvas.bind(this))
      // this.controls['Shadow'] = gui.add(config, 'Shadow', 0, 0.8).name('阴影范围')
      this.controls['Spacing'] = this.motionFolder
        .add(this.config, 'Spacing', 0, 200)
        .name('粒子间距')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Points'] = this.motionFolder
        .add(this.config, 'Points', 1, 15)
        .step(1)
        .name('粒子层数')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Emission'] = this.motionFolder
        .add(this.config, 'Emission', 1, 20)
        .name('同步程度')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Repeate'] = this.motionFolder
        .add(this.config, 'Repeate', 1, 20)
        .name('密度')
        .onChange(this.resetCanvas.bind(this))
      this.controls['maxSize'] = this.motionFolder
        .add(this.config, 'maxSize', 10, 50)
        .name('粒子最大尺寸')
        .onChange(this.resetCanvas.bind(this))
      this.controls['minSize'] = this.motionFolder
        .add(this.config, 'minSize', 0, 10)
        .name('粒子最小尺寸')
        .onChange(this.resetCanvas.bind(this))
      this.motionFolder
        .add(this.config, 'Rotate')
        .name('是否旋转')
        .onChange(this.resetCanvas.bind(this))
      this.motionFolder.open()
    }

    initSizeGUI () {
      this.sizeFolder = this.gui.addFolder('画布尺寸')
      this.sizeFolder
        .add(this.config, 'Width')
        .name('宽度')
        .onChange(this.resetCanvas.bind(this))
      this.sizeFolder
        .add(this.config, 'Height')
        .name('高度')
        .onChange(this.resetCanvas.bind(this))
    }

    initAdvancedGUI () {
      this.gui
        .add(this.config, 'time')
        .step(1).name('持续时间（秒，0为无限制）', 0)
        .onChange((val) => {
          if (val === 0) this.resetCanvas()
        })
    }

    randomData() {
      const { controls } = this
      const Color1 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)]
      const Color2 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)]
      const Speed = getRandom(1, 10)
      // const Shadow = getRandom(0, 0.8)
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
      // controls['Shadow'].setValue(Shadow)
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
