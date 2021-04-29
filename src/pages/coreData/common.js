// 分换算成万，并保留两位小数, null的时候是‘-’
export const numberFormat = (number) => {
  if(number == null) {
    return '-'
  }
  let resNumber = number/1000000;
  if(!Number.isNaN(number) && !Number.isNaN(resNumber)) {
    return parseFloat(resNumber.toFixed(2));
  }
  return '-'
}

// 分换算成万, null的时候是‘’
export const numberFormatCent = (number) => {
  if(number == null) {
    return ''
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