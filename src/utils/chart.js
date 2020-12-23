import Taro from '@tarojs/taro'
import utils from './index.js'

const _ = require('./lodash.js')
const { rpxTopx } = utils
export default function (ctx, options, that) {
  return new LineChart(ctx, options, that)
}

function LineChart(ctx, options, that) {
  this.canvasId = ctx
  const query = Taro.createSelectorQuery()
  query
    .select(`#${ctx}`)
    .context((res) => {
      this.ctx = res.context
      this.options = Object.assign(
        {
          width: 320,
          height: 200,
          xUnit: '',
          yUnit: '',
          xAxis: [],
          key: [],
          lines: [],
          margin: 20,
          fontSize: 12,
        },
        options,
        {
          xAxisOffset: (options.margin || 20) + (options.fontSize || 12) * 2.5,
        },
      )

      this._attrs = {}
      this.that = that

      if (_.isEmpty(this.options.xAxis)) {
        throw new Error('options.xAxis can not be empty')
      }

      if (_.isEmpty(this.options.lines)) {
        throw new Error('options.lines can not be empty')
      }
      this.draw()
    })
    .exec()
}

LineChart.prototype.draw = function () {
  this._drawAxis()
  this._drawLines()

  this._draw()
}

LineChart.prototype._drawAxis = function () {
  let {
    width,
    height,
    lines,
    labelColor,
    axisColor,
    xUnit,
    yUnit,
    xAxis,
    margin,
    xAxisOffset,
    fontSize,
  } = this.options
  let ctx = this.ctx
  ctx.setFontSize(fontSize)

  let yAxisLen = height - margin - xAxisOffset
  let yLabelCount = Math.floor(yAxisLen / 25)
  let yMaxValue = _.max(_.map(lines, (item) => _.max(item.points))) || 1

  // 计算需要绘制的y轴label
  let fixed = 0
  let yDelta = (yMaxValue * 1.2) / yLabelCount
  if (yDelta < 1) {
    fixed = Math.round(1 / yDelta).toString().length
  }
  yDelta = Number(fixed === 0 ? Math.ceil(yDelta) : yDelta.toFixed(fixed))
  let labels = []
  for (let i = 2; i <= yLabelCount; i++) {
    labels.push(Number(((i - 1) * yDelta).toFixed(fixed)) + yUnit)
  }

  let xLabelMaxWidth = _.max(
    _.map(xAxis, (item) => ctx.measureText(item + xUnit).width),
  )
  let yLabelMaxWidth =
    _.max(_.map(labels, (item) => ctx.measureText(item).width)) + margin
  // let xAxisLen = width - margin - yLabelMaxWidth; x轴间距改动
  let xAxisLen = width
  let xOffset = yLabelMaxWidth
  // let xStep = xAxisLen / (xAxis.length - 1);
  let xStep = rpxTopx(208) + rpxTopx(8)

  // let yOffset = margin + yAxisLen;y轴改动
  let yOffset = margin + yAxisLen
  let yStep = yAxisLen / (yMaxValue * 1.2)

  // //绘制x轴label
  // let xLabelCount = Math.floor(xAxisLen / xLabelMaxWidth);
  // let xLabelStep = Math.ceil(xAxis.length / xLabelCount);
  // //需要被绘制的lable
  // let xLabel = _.filter(_.map(xAxis, (item, index) => ({
  //     name: item + xUnit,
  //     index: index
  // })), (item, index) => index % xLabelStep === 0);
  // _.each(xLabel, item => {
  //     let xValue = xOffset + item.index * xStep - xLabelMaxWidth / 2 - 2;
  //     ctx.fillStyle = labelColor;
  //     ctx.fillText(item.name, xValue, height - margin);
  // });

  //   // 绘制y轴label，以及水平标记线
  //   _.each(labels, (item, index) => {
  //     let xValue = (yLabelMaxWidth - ctx.measureText(item).width) - 5;
  //     let yValue = yOffset - yStep * Number((index + 1) * yDelta).toFixed(fixed);

  //     // 水平标记线
  //     ctx.beginPath();
  //     ctx.lineWidth = 0.8;
  //     ctx.strokeStyle = axisColor;
  //     ctx.moveTo(yLabelMaxWidth, yValue);
  //     ctx.lineTo(width - margin, yValue);
  //     ctx.stroke();

  //     // label
  //     ctx.strokeStyle = labelColor;
  //     ctx.fillText(item, xValue, yValue + 4);
  // });

  // 将这几个数据存放在attrs上，绘制线的时候有用
  Object.assign(this._attrs, {
      xOffset,
      yOffset,
      xStep,
      yStep
  });
};

LineChart.prototype._drawLines = function () {
  _.each(this.options.lines, (item) => {
    if (item.hidden) {
      return
    }

    this._drawLine(item)
  })
}

LineChart.prototype._drawLine = function (line) {
  let { xOffset, yOffset, xStep, yStep } = this._attrs
  let ctx = this.ctx

  let points = _.map(line.points, (item, index) => {
    const xGrap = parseInt(index * xStep)
    //    return ({
    //     x: xOffset + index * xStep ,
    //     y: yOffset - item * yStep
    //     })
    return {
      redDot: line.redDot[index],
      x: rpxTopx(134) + xGrap,
      y: yOffset - item * yStep,
    }
  })

  // 与x轴的面积阴影
  // ctx.beginPath()
  // // ctx.globalAlpha = 0.2;
  // var linearGradient = ctx.createLinearGradient(0, 100, 0, 0)
  // linearGradient.addColorStop(0, 'rgba(121,140,186,0.00)')
  // // linearGradient.addColorStop(0.3,'rgba(121,140,186,0.08)');
  // linearGradient.addColorStop(1, 'rgba(121,140,186,0.3)')
  // ctx.fillStyle = linearGradient
  // ctx.moveTo(0, yOffset)
  // _.each(points, (item, index) => {
  //   ctx.lineTo(item.x, item.y)
  //   if (index === points.length - 1) {
  //     ctx.lineTo(item.x + 208, yOffset)
  //   }
  // })

  // ctx.lineTo(xOffset + xStep * (points.length - 1), yOffset);
  ctx.lineTo(xOffset + xStep, 11111)
  ctx.closePath()
  ctx.fill()

  // 线
  ctx.beginPath();
  // ctx.globalAlpha = 1;
  ctx.lineWidth = 1;
  console.log(line.color);
  ctx.strokeStyle = line.color;
  _.each(points, item => {
      ctx.lineTo(item.x, item.y);
  });
  ctx.stroke();

  // 空心点

  _.each(points, (item) => {
    ctx.beginPath()
    if (item.redDot === 1) {
      ctx.arc(item.x, item.y, 4, 0, 4 * Math.PI)
      ctx.closePath()
      ctx.fillStyle = '#ff0000'
    } else {
      // ctx.fillStyle = '#798CBA'
    }

    ctx.lineWidth = 2
    ctx.strokeStyle = '#ffffff'
    ctx.fill()
    ctx.stroke()
  })
}

LineChart.prototype._draw = function () {
  if (this._timer) {
    clearTimeout(this._timer)
  }

  this._timer = setTimeout(() => {
    const t = this
    this.ctx.draw(true, () => {
      Taro.canvasToTempFilePath({
        canvasId: t.canvasId,
        fileType: 'png',
        success: function (res) {
          t.that.setState({
            imgSrc: res.tempFilePath,
          })
        },
      })
    })
  })
}
