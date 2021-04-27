// 分换算成万，并保留两位小数
export const numberFormat = (number) => {
  let res = '';
  if(number=='') {
    res = '-'
  }else{
    let resNumber = number/1000000;
    res = Number.isNaN(parseFloat(resNumber.toFixed(2))) ? '-' : parseFloat(resNumber.toFixed(2));
  }
  return res;
}
export const centChangeTenThousand = (number) => {
  return Number(number) * 10000
}