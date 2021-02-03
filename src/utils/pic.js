/**
 * @description: handle pic's url & u can customize the width and height if u want
 * @param {string} url Must
 * @param {number} width Optional
 * @param {number} height Optional
 * @returns {string}
 * @reference https://wiki.maoyan.com/pages/viewpage.action?pageId=128395074
 */
export function picFn(url = '', width, height) {
  if (!url) return url;
  const innerUrl = url.trim();

  if (url.indexOf('pipi.cn') > -1) {
    url += `?imageView2/w/${width}/h/${height}`;
    return url;
  }

  if (innerUrl.indexOf('/w.h/') === -1) return innerUrl;
  if (width && height) return innerUrl.replace('/w.h/', `/${width}.${height}/`);

  return innerUrl.replace('/w.h/', '/');
}

const utils = {
  picFn,
};
export default utils;