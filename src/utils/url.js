function addUrlArg(url, key, value) {
  function addQueryStings(url, key, value) {
    function addQuerySting(url, key, value) {
      if (url.indexOf('?') === -1) {
        url += '?';
      } else {
        url += '&';
      }
      url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
      return url;
    }

    if (typeof key === 'object') {
      for (let k in key) {
        url = addQuerySting(url, k, key[k]);
      }
    } else if (typeof key === 'string') {
      url = addQuerySting(url, key, value);
    }
    return url;
  }

  if (url.indexOf('#') === -1) {
    url = addQueryStings(url, key, value);
  } else {
    let hash = url.split('#')[1] || '';
    url = url.split('#')[0];
    url = addQueryStings(url, key, value);
    this.addHash(url, hash);
  }
  return url;
};

export default addUrlArg;
export {
  addUrlArg
}