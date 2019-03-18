import p5 from 'p5'

class ParticlesEmmision {
  constructor(options = {}) {
    this.options = options
    this.stars = []
    let realWidth = document.documentElement.clientWidth
    let realHeight = document.documentElement.clientHeight
    let canvasWidth = options.Width
    let canvasHeight = options.Height
    if (realWidth < options.Width) {
      canvasWidth = realWidth
    }
    if (realHeight < options.Height) {
      canvasHeight = realHeight
    }
    this.isPlay = false
    this.width = canvasWidth
    this.height = canvasHeight
    this.theata = 0
    this.sketch = (p) => {
      p.setup = this.setup.bind(this, p)
      p.draw = this.draw.bind(this, p)
      this.p = p
    }

    this.init()
  }

  init() {
    const { time } = this.options

    this.p5 && this.p5.remove()
    this.p5 = new p5(this.sketch)

    clearTimeout(this.timer)
    const numReg = /^[0-9]*$/
    if (!numReg.test(time)) return
    const ms = Number(time) * 1000
    if (ms > 0) {
      this.timer = setTimeout(() => {
        this.p5.remove()
      }, ms)
    }
    this.isPlay = true
  }

  setup(p) {
    const { width, height, options } = this
    this.myCanvas = p.createCanvas(width, height)
    this.myCanvas.canvas.style = `pointer-events: none; position:fixed; top:0; left:50%; transform: translateX(-50%); width: ${width}px; height: ${height}px; z-index: -1`
  }

  draw(p) {
    const { options, width, height } = this
    const shadow = 'rgba(255, 255, 255,' + (1 - options.Shadow) + ')'
    this.myCanvas.drawingContext.clearRect(0, 0, width * 2, height * 2)

    p.translate(width / 2, height / 2)

    for (var k = 0; k < options.Repeate; k++) {
      for (var i = 0; i < options.Points; i++) {
        for (var j = 0; j < options.Points; j++) {

          var ratio = p.dist(i, j, 0, 0) / options.Emission
          var angle = p.sin(p.millis() / 2000 * options.Speed + ratio * (p.PI / 2))

          var b = (options.Spacing)

          var scale = p.map(options.Points, 5, 50, 400, 1000)
          var r = p.map(p.dist(i * b, j * b, 0, 0), 0, scale, options.maxSize, options.minSize)


          if (options.FullScreen == false) {
            if (p.dist(i * b, j * b, 0, 0) > scale) {
              r = 0
            }
          }

          var percent = p.norm(p.pow(j + i, 1.2), 0, options.Points)

          let from = p.color(options.Color1)
          let to = p.color(options.Color2)
          let between = p.lerpColor(from, to, percent)


          var x = i * b * p.abs((p.cos(angle)) / 2)
          var y = j * b * p.abs((p.cos(angle)) / 2)

          p.push()
          p.rotate(p.radians(this.theata))

          if (options.Shape == 'image') {
            options.Repeate = 1
            r = p.map(p.dist(i * b, j * b, 0, 0), 0, scale, options.maxSize, options.minSize)
            p.image(img, x, y, r, r)
            p.image(img, -x, y, r, r)
            p.image(img, -x, -y, r, r)
            p.image(img, x, -y, r, r)
          }
          else if (options.Shape == 'Text') {
            p.textSize(r)
            p.fill(between)
            options.Repeate = 1
            var s = options.Text
            p.text(s, x, y)
            p.text(s, -x, y)
            p.text(s, -x, -y)
            p.text(s, x, -y)
          }
          else if (options.Shape == 'Circle') {
            if (options.Repeate == 1) {
              options.Repeate += 3
            }

            p.fill(between)
            p.noStroke()
            p.ellipse(x, y, r, r)
          }
          else if (options.Shape == 'Rectangle') {
            if (options.Repeate == 1) {
              options.Repeate += 3
            }
            p.fill(between)
            p.noStroke()
            p.rect(x, y, r, r)
          }
          else if (options.Shape == 'Line') {
            if (options.Repeate == 1) {
              options.Repeate += 3
            }
            p.stroke(between)
            p.strokeWeight(r / 10)
            p.noFill()
            p.line(x, y, x + 2 * r * p.sin(angle), y + 2 * r * p.sin(angle))
          } else if (options.Shape == 'Diamond') {
            if (options.Repeate == 1) {
              options.Repeate += 3
            }
            p.fill(between)
            p.noStroke()
            p.beginShape()
            var x = (i + 0.5) * b * p.abs((p.cos(angle)) / 2)
            var y = (j + 0.5) * b * p.abs((p.cos(angle)) / 2)
            p.vertex(x, y)
            p.vertex(x + r / 3, y - r / 3 * 2)
            p.vertex(x + r, y - r)
            p.vertex(x + r / 3 * 2, y - r / 3)
            p.endShape(p.CLOSE)
          } else {
            if (options.Repeate == 1) {
              options.Repeate += 3
            }
            p.fill(between)
            p.noStroke()
            p.ellipse(x, y, r, r)
          }
          p.pop()
        }
      }

      if (options.Rotate == true) {
        this.theata += 0.08
      }
      p.rotate(p.TWO_PI / p.int(options.Repeate + 0.1))
    }
  }

  update(newOptions) {
    console.log(newOptions)
    this.options = newOptions
    let realWidth = document.documentElement.clientWidth
    let realHeight = document.documentElement.clientHeight
    let canvasWidth = newOptions.Width
    let canvasHeight = newOptions.Height
    if (realWidth < newOptions.Width) {
      canvasWidth = realWidth
    }
    if (realHeight < newOptions.Height) {
      canvasHeight = realHeight
    }
    this.width = canvasWidth
    this.height = canvasHeight
    this.init()
  }

  pause() {
    this.p5.noLoop()
  }

  replay() {
    this.p5.loop()
  }

  toggle () {
    this.isPlay ? this.pause() : this.replay()
    this.isPlay = !this.isPlay
  }

  destroy() {
    this.p5.remove()
  }
}

export default ParticlesEmmision
