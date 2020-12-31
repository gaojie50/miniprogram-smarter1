import Taro from '@tarojs/taro'
import utils from './index.js'

const { rpxTopx, arrayMaxItem, } = utils

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
  this._drawLines();
  this._drawToPng();  //转为png
};

LineChart.prototype._drawLines = function () {
  let { width, height, lines,} = this.options;
  let ctx = this.ctx;
  let yLabelCount = 6;
  let yAxisLen = height * (1 - 1/yLabelCount);
  let yMaxValue = arrayMaxItem(lines[0].points);
  let yOffset = yAxisLen + height / (2 * yLabelCount);
  let yMaxLength = yMaxValue * 1.2;
  let yStep = yAxisLen / yMaxLength;

  /**
   * 绘制水平标记线 Start
   */
  for(let i = 0 ; i < 6 ; i++){
    let yValue = rpxTopx(29 * ( 1 + 2 * i ));

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.moveTo(rpxTopx(88),yValue);
    ctx.lineTo(width, yValue);
    ctx.strokeStyle = "rgba(255,255,255,.2)";
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
  }
  /**
   * 绘制水平标记线 End
   */

  // 将这几个数据存放在attrs上，绘制线的时候有用
  Object.assign(this._attrs, { yOffset, yStep,yMaxLength});

  this.options.lines.map((item) => {
    if (item.hidden) return;

    this._drawLine(item)
  })
}

LineChart.prototype._drawLine = function (line) {
  let { yOffset, yStep } = this._attrs;
  let ctx = this.ctx;
  let {points,redDot,color,dash=false} = line;

  let handlePoints = points.map((item, index) => { 
    return {
      redDot: redDot[index],
      x: rpxTopx(216/2 + 30) + (index * rpxTopx(216 + 10)),
      y: yOffset - item * yStep,
    }
  })

  ctx.closePath();
  ctx.fill();

  // 线
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;

  if(dash) ctx.setLineDash([4, 6]);

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

  this._timer = setTimeout(() => {
    const {canvasId, that, _attrs} = this;
    const { yMaxLength } = _attrs;

    this.ctx.draw(true, () => {
      Taro.canvasToTempFilePath({
        canvasId: canvasId,
        fileType: 'png',
        success: function (res) { 
          that.props.setMaxLengthY(yMaxLength);
          that.setState({ imgSrc: res.tempFilePath }) },
      })
    })
  })
}
