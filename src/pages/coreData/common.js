// 分换算成万，并保留两位小数
export const numberFormat = (number, isFixed = true) => {
  console.log('number', number);
  let resNumber = number/1000000;
  if(number == null) {
    return ''
  }
  if(!Number.isNaN(number) && !Number.isNaN(resNumber)) {
    return isFixed ? parseFloat(resNumber.toFixed(2)) : parseFloat(resNumber) ;
  }
  return '-'
}

export const centChangeTenThousand = (number) => {
  return Number(number) * 1000000;
}