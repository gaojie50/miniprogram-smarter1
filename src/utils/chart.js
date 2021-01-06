import Taro from '@tarojs/taro'
import utils from './index.js'

const { rpxTopx, } = utils

export default (ctx, options, that) => new LineChart(ctx, options, that); 

function LineChart(ctx, options, that) {
  this.canvasId = ctx;

  Taro.createSelectorQuery().select(`#${ctx}`)
    .context((res) => {
      this.ctx = res.context;
      this.options = options;
      this._attrs = {};
      this.that = that;
      this.draw();
    }).exec()
}

LineChart.prototype.draw = function () {
  this.clearCanvas();
  this._subline();
  this._drawLines();
  this._drawToPng();  //转为png
};

LineChart.prototype._subline = function(){
  let ctx = this.ctx;

  for (let i = 0; i < 6; i++) {
    let yValue = rpxTopx(29 * (1 + 2 * i));

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.moveTo(rpxTopx(88), yValue);
    ctx.lineTo(this.options.width, yValue);
    ctx.strokeStyle = "rgba(255,255,255,.2)";
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
  }
}

LineChart.prototype.clearCanvas = function(){
  let ctx = this.ctx;
  let {width,height} = this.options;
  
  ctx.clearRect(0,0,width,height);
}

LineChart.prototype._drawLines = function () {
  let {height, yMaxLength, } = this.options;
  let yLabelCount = 6;
  let yAxisLen = height * (1 - 1 / yLabelCount);
  let yOffset = yAxisLen + height / (2 * yLabelCount);

  let yStep = yAxisLen / yMaxLength;

  Object.assign(this._attrs, { yOffset, yStep, });

  this.options.lines.map((item) => {
    if (item.hidden) return;

    this._drawLine(item)
  })
}

LineChart.prototype._drawLine = function (line) {
  let { yOffset, yStep } = this._attrs;
  let ctx = this.ctx;
  let { points, redDot, color, dash = false } = line;

  let handlePoints = points.map((item, index) => {
    return {
      redDot: redDot[index],
      x: rpxTopx(216 / 2 + 30) + (index * rpxTopx(216 + 10)),
      y: yOffset - item * yStep,
    }
  })

  ctx.closePath();
  ctx.fill();

  // 线
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;

  if (dash) ctx.setLineDash([4, 6]);

  handlePoints.map(item => { ctx.lineTo(item.x, item.y) });
  ctx.stroke();

  // 空心点
  handlePoints.map((item) => {
    ctx.beginPath()
    ctx.setLineDash([]);
    if (item.redDot === 1) {
      ctx.arc(item.x, item.y, 4, 0, 4 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = '#F00';
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFF';
    ctx.fill();
    ctx.stroke();
  })
}

LineChart.prototype._drawToPng = function () {
  if (this._timer) clearTimeout(this._timer);
  
  const chartPic = document.getElementById('chart-pic');
  
  this._timer = setTimeout(() => {
    const { canvasId,} = this;

    this.ctx.draw(false, () => {
      Taro.canvasToTempFilePath({
        canvasId: canvasId,
        fileType: 'png',
        success: function (res) {
          chartPic.setAttribute('src',res.tempFilePath);
          // that.setState({ imgSrc: res.tempFilePath })
        },
      })
    })
  })
}
