//错误处理
const errorHandle = (err) => {
  console.warn(err);
  return err;
};

function debounce(fn, interval,first=false) {
  let timer;
  let gapTime = interval || 1000;

  return function () {
    clearTimeout(timer);
    let context = this;
    let args = arguments[0];
    
    if(first){
      fn.call(context, args);
      first=false;
    }
    
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

function limit(func, wait, debounce) {
  var timeout;
  return function() {
      var context = this, args = arguments;
      // 封装函数,用于延迟调用
      var throttler = function() {
          // 只是节流函数的时候,对其timeout进行赋值为null,这样可以设置下一次的setTimtout
          timeout = null;
          func.apply(context, args);
      };
      // 如果debouce是true的话,前一个函数的调用timeout会被清空,不会被执行
      if (debounce) clearTimeout(timeout);
      // 如果debouce是true 或者 timeout 为空的情况下,设置setTimeout
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
  };
};

function throttle(func, wait) {
  return limit(func, wait, false);
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

const handleReleaseDesc = (showType, date) => {
  if(showType === 1) {
    const newDate = date.slice(5,10);
    const result = newDate.replace(/-/g, ".");
    return result
  } else if (showType === 2){
    const newDate = date.slice(5,7);
    if(newDate[0] === '0'){
      const result = newDate.slice(1);
      return `${result}月`
    } else {
      return `${newDate}月`
    }
  } else if(showType === 3){
    const startTime = date.slice(5, 10).replace(/-/g, ".");
    const endTime = date.slice(16, 21).replace(/-/g, ".");
    return `${startTime}~${endTime}`
  }
  else if(showType === 4){
    const newDate = date.slice(0, 4);
    return newDate
  }
   else {
    return date
  }
}

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
      return `${endDate.m}.${endDate.d}`
    }
    if(date.endDate === null && date.startDate !==null){
      const endDate = formateDate(date.endDate);
      return `${startDate.m}.${startDate.d}`
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
          } else if (startDate.m === endDate.m && startDate.d === 1 && endDate.d === 31){
            const clurM = ("0" + startDate.m).slice(-2);
            return `${startDate.y}.${clurM}`
          }
          else {
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

function checkDataType(param) {
  return Object.prototype.toString.call(param).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
}

function isObject(param) { return checkDataType(param) === "object" };

function isArray(param) { return checkDataType(param) === "array" };

const assignDeep = (...objects) => {
  return objects.reduce((accumulator, currentValue) => {
      Object.keys(currentValue).forEach(key => {
          const pVal = accumulator[key];
          const oVal = currentValue[key];

          if (isArray(pVal) && isArray(oVal)) {
              accumulator[key] = pVal.concat(...oVal);
          } else if (isObject(pVal) && isObject(oVal)) {
              accumulator[key] = assignDeep(pVal, oVal);
          } else {
              accumulator[key] = oVal;
          }
      });

      return accumulator;
  }, {});
}

function handleNewDate(param){
  return new Date(checkDataType(param) == 'string' ? 
  param.replace(/\.|\-/g, '/') : param);
}

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

function formatWeekDate(date){
  const start = formateDate(date);
  const end = formateDate(date);
  if(start.y === start.y){
    return `${start.m}.${start.d}-${end.m}.${end.d}`
  }
}

export default {
  errorHandle,
  debounce,
  throttle,
  rpxTopx,
  formatNumber,
  formatReleaseDate,
  formatDirector,
  getFutureTimePeriod,
  calcWeek,
  assignDeep,
  checkDataType,
  handleReleaseDesc,
  handleNewDate,
  formatWeekDate
}