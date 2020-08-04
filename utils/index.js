//错误处理
const errorHandle = (err) => {
  console.warn(err);
  return err;
};

//防抖
const throttle = function (func, wait, options) {
  let context, args, result;
  let timeout = null;
  let previous = 0;

  if (!options) options = {};

  const later = function () {
    previous = options.leading === false ? 0 : +new Date;
    timeout = null;

    result = func.apply(context, args);

    if (!timeout)
      context = args = null;
  };

  return function () {
    let now = +new Date;

    if (!previous && options.leading === false)
      previous = now;

    let remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);

        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);

      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
};


const rpxTopx = function(rpx){
  return rpx / 750 * wx.getSystemInfoSync().windowWidth;
};

const calcValue = (paramValue, digits) => {
  return Math.floor(paramValue * Math.pow(10, digits)) / Math.pow(10, digits);
};

//四舍五入
const formatNumber = (value, sign) => {
  if (value === 0) {
    return {
      posNum: 0,
      num: 0,
      unit: '',
      posText: '0',
      text: '0',
      decimals: 0,
    };
  }
  if (value == null || value == '') {
    return {
      posNum: '-',
      num: '-',
      unit: '',
      posText: '-',
      text: '-',
      decimals: 0,
    };
  }

  if (value < 10000) {
    return {
      posNum: Math.abs(value),
      posText: Math.abs(value),
      num: value,
      unit: '',
      text: value,
      decimals: 0,
    };
  }
  if (value < 100000000) {
    if (sign == 'floor') {
      const floorNum = calcValue(value / 10000, 1).toFixed(1);
      return {
        posNum: Math.abs(floorNum),
        posText: `${Math.abs(floorNum)}万`,
        num: floorNum,
        unit: '万',
        text: `${floorNum}万`,
        decimals: 1,
      };
    }

    const num = (value / 10000).toFixed(1);
    return {
      posNum: Math.abs(num),
      posText: `${Math.abs(num)}万`,
      num,
      unit: '万',
      text: `${num}万`,
      decimals: 1,
    };
  }
  if (value >= 100000000) {
    if (sign == 'floor') {
      const floorNum = calcValue(value / 100000000, 2).toFixed(2);
      return {
        posNum: Math.abs(floorNum),
        posText: `${Math.abs(floorNum)}亿`,
        num: floorNum,
        unit: '亿',
        text: `${floorNum}亿`,
        decimals: 2,
      };
    }

    const num = (value / 100000000).toFixed(2);
    return {
      posNum: Math.abs(num),
      posText: `${Math.abs(num)}亿`,
      num,
      unit: '亿',
      text: `${num}亿`,
      decimals: 2,
    };
  }
};

//上映时间处理
const formatReleaseDate = (date) => {

    const time = new Date(date);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var result = `${m}.${d}`;
    return result
  // const value = time.toLocaleString();
  // const t = formatDate(1000083546565765)

}

export default {
  errorHandle,
  throttle,
  rpxTopx,
  formatNumber,
  formatReleaseDate
}