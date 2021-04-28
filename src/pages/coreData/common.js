// 分换算成万，并保留两位小数
export const numberFormat = (number, isNotFixed = false) => {
  if(!Number.isNaN(number)) {
    let resNumber = number/1000000;
    return isNotFixed ? parseFloat(resNumber) : parseFloat(resNumber.toFixed(2));
  }
  return '-'
}

export const centChangeTenThousand = (number) => {
  return Number(number) * 1000000
}