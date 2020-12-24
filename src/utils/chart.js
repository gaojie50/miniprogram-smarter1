import Taro from '@tarojs/taro'
import utils from './index.js'
import _ from './lodash.js'

const { rpxTopx } = utils

export default function (ctx, options, that) { return new LineChart(ctx, options, that) }

function LineChart(ctx, options, that) {
  this.canvasId = ctx
  const query = Taro.createSelectorQuery()
  query.select(`#${ctx}`)
    .context((res) => {
      this.ctx = res.context
      this.options = options
      this._attrs = {}
      this.that = that

      this.draw()
    }).exec()
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
    yUnit,
    marginLR,
    fontSize,
  } = this.options
  let ctx = this.ctx
  ctx.setFontSize(fontSize)

  let yAxisLen = height - 30;
  let yLabelCount = 6;
  let yMaxValue = _.max(_.map(lines, (item) => _.max(item.points))) || 1

  // 计算需要绘制的y轴label
  let fixed = 0
  let yDelta = (yMaxValue * 1.2) / yLabelCount
  if (yDelta < 1) {
    fixed = Math.round(1 / yDelta).toString().length
  }
  yDelta = Number(fixed === 0 ? Math.ceil(yDelta) : yDelta.toFixed(fixed))
  let labels = [];
  for (let i = 1; i <= yLabelCount; i++) {
    labels.push(Number(((i - 1) * yDelta).toFixed(fixed)) + yUnit)
  }

  let yLabelMaxWidth = _.max(_.map(labels, (item) => ctx.measureText(item).width)) + marginLR
  let xOffset = yLabelMaxWidth
  let xStep = rpxTopx(216) + rpxTopx(10)

  let yOffset = yAxisLen + 20
  let yStep = yAxisLen / (yMaxValue * 1.2)

  // 绘制y轴label，以及水平标记线
  _.each(labels, (item, index) => {
    let xValue = (yLabelMaxWidth - ctx.measureText(item).width);
    let yValue = yOffset - yStep * Number((index) * yDelta).toFixed(fixed);

    // 水平标记线
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.moveTo(xValue, yValue);
    ctx.lineTo(width - marginLR, yValue);
    ctx.strokeStyle = "rgba(255,255,255,.2)";
    ctx.stroke();
    ctx.setLineDash([]);

    // label
    ctx.beginPath();
    // ctx.fillStyle = "rgba(255,255,255,0.6)";
    // ctx.font = "normal normal lighter 11rpx PingFangSC-Light";
    // ctx.fillText(item, xValue, yValue);
  });

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


  ctx.lineTo(xOffset + xStep, 11111)
  ctx.closePath()
  ctx.fill()

  // 线
  ctx.beginPath();
  // ctx.globalAlpha = 1;
  ctx.lineWidth = 1;
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
