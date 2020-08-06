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
const formatReleaseDate = date => {
  if(date === null) {
    return '-'
  } else {
    const formateDate = function (t){
      const time = new Date(t);
      const y = time.getFullYear();
      const m = time.getMonth() + 1;
      const d = time.getDate();
      return {
        y,
        m,
        d
      }
    }
    
    if(date.startDate === null && date.endDate !==null){
      const startDate = formateDate(date.startDate);
      return `${startDate.m}.${startDate.d}`
    }
    if(date.endDate === null && date.startDate !==null){
      const endDate = formateDate(date.endDate);
      return `${endDate.m}.${endDate.d}`
    }
    if(date.endDate !== null && date.startDate !==null){
      const startDate = formateDate(date.startDate);
      const endDate = formateDate(date.endDate);
      const nowDate = new Date();
      const nowYear = nowDate.getFullYear();

      if(startDate.y !== nowYear){
        return startDate.y
      } 
      else {
        if((startDate.m === endDate.m) && (startDate.d === endDate.d)){
          const m1 = ("0" + startDate.m).slice(-2);
          const d1 = ("0" + startDate.d).slice(-2);
          return `${m1}.${d1}`
        } else {
          if(startDate.m === 1 && startDate.d === 1 && endDate.m === 12 && endDate.d === 31){
            return startDate.y
          }
          const m2 = ("0" + startDate.m).slice(-2);
          const d2 = ("0" + startDate.d).slice(-2);
          const m3 = ("0" + endDate.m).slice(-2);
          const d3 = ("0" + endDate.d).slice(-2);
          return `${m2}.${d2}~${m3}.${d3}`
        }
      }
    }
   
  }
}

//处理导演顿号
const formatDirector = director => {
  if(director !== null){
    let str = '';
    for(let i=0; i<director.length; i++){
      str = str + director[i] + '、';
    }
    const result = str.substring(0, str.length-1);
    return result
  }
}


const getFutureTimePeriod = (long = 365) =>{
  const curDayBeginDate = new Date(new Date().setHours(0, 0, 0, 0));
  const curDayEndDate = new Date(new Date().setHours(23,59,59,999));

  return {
    startDate: curDayBeginDate.setDate(curDayBeginDate.getDate() + 1),
    endDate: curDayEndDate.setDate(curDayEndDate.getDate() + long),
  } 
}

const calcWeek = timeStamp =>`周${['日', '一', '二', '三', '四', '五', '六'][new Date(timeStamp).getDay()]}`;

export default {
  errorHandle,
  throttle,
  rpxTopx,
  formatNumber,
  formatReleaseDate,
  formatDirector,
  getFutureTimePeriod,
  calcWeek,
}