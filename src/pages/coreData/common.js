// 分换算成万，并保留两位小数
export const numberFormat = (number) => {
  let resNumber = number/1000000;
  return Number.isNaN(parseFloat(resNumber.toFixed(2))) ? '' : parseFloat(resNumber.toFixed(2));
}