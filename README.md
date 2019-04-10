## 使用方法

```
jnpm i @o2team/ambient-particles_emission --save
```

```javascript
import ATAmbient from '@o2team/ambient-particles_emission'

ATAmbient({
  Width: 1960,
  Height: 1120,
  Color1: '#41b1b6',
  Color2: '#4814c9',
  Spacing: 141.48955868714648,
  Speed: 1.2969418137908204,
  Points: 6,
  Emission: 16.58526000411766,
  Repeate: 18.428336328769582,
  maxSize: 22.28067552780178,
  minSize: 0.6439547595750583,
  time: 0,
  Shape: 'Text',
  Text: '❤',
  Rotate: false
})
```

## 配置说明

| 字段 | 类型 | 可选值 | 效果 |
|-|-|-|-|
| Width | `number` | - | 元素所占宽度（默认浏览器宽度） |
| Height | `number` | - | 元素所占高度（默认浏览器高度） |
| Color1 | `string` | 带 `#` 色值 | 中心粒子色 |
| Color2 | `string` | 带 `#` 色值 | 外围粒子色 |
| Spacing | `number` | 0-200 | 粒子间距 |
| Speed | `number` | 1-10 | 粒子速度 |
| Points | `number` | 1-15 | 粒子层数 |
| Emission | `number` | 1-20 | 同步程度 |
| Repeate | `number` | 1-20 | 粒子密度 |
| maxSize | `number` | 10-50 | 粒子最大尺寸 |
| minSize | `number` | 0-10 | 粒子最小尺寸 |
| time | `number` | - | 持续时间（秒，0为无限制） |
| Shape | `string` | `['文字', '圆形', '方形', '线形', '钻石形']` | 粒子图案 |
| Text | `string` | - | 文字（仅在粒子图案为 `文字` 时有效） |
| Rotate | `boolean` | `true`, `false` | 是否旋转 |

## 预览地址

https://o2team-ambient.github.io/particles_emission/dist/?controller=1

## 项目结构

```
├── config                  - 编译配置
│   ├── base.conf.js
│   └── custom.conf.js
├── info.json               - 组件信息
└── src
    ├── css
    │   ├── base.scss
    │   └── package.scss
    ├── index.ejs
    ├── index.js            - 主入口文件
    ├── rollup_index.js     - npm 包主入口文件
    ├── config.js           - 控制板参数配置文件（单独打包）
    ├── control.js          - 控制板入口文件（单独打包）
    └── js
        ├── ambient.js
        ├── controlinit.js  - 控制板自定义代码
        └── utils
            ├── const.js    - 字段常数
            ├── raf.js
            └── util.js
```

> 开发完毕之后，请新建 gh-pages 分支并 push --set-upstream，以获得线上 demo 页。每次更新后，测试完成即可合并至 gh-pages 发布。