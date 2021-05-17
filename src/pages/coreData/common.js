// 分换算成万，并保留两位小数, null的时候是‘-’
export const numberFormat = (number) => {
  if(number == null) {
    return {
      num:  '-',
      unit: '',
    }
  }
  const isNegativeNumber = number<0
  if(!Number.isNaN(number)) {
    if(number<0) {
      number = number*-1
    }
    if (number>=0 && number < 10000000000) {
      const num = number/1000000
      return {
        num: isNegativeNumber ? parseFloat(num.toFixed(2))*-1 : parseFloat(num.toFixed(2)),
        unit: '万',
      }
    }
    if (number >= 10000000000) {
      const num = number/10000000000
      return {
        num: isNegativeNumber ? parseFloat(num.toFixed(2))*-1 :  parseFloat(num.toFixed(2)),
        unit: '亿',
      }
    }
  }
  return {
    num:  '-',
    unit: '',
  }
}

// 分换算成万, null的时候是‘’
export const numberFormatCent = (number) => {
  if(number == null) {
    return ''
  }
  if(number == '0') {
    return 0;
  }
  let resNumber = number/1000000;
  if(!Number.isNaN(number) && !Number.isNaN(resNumber)) {
    return parseFloat(resNumber) ;
  }
  return ''
}

export const centChangeTenThousand = (number) => {
  return Number(number) * 1000000;
}