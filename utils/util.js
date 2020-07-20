const errorHandle = (err, origin) => {
  if (origin == 'ServerError') {
    //服务器错误
    return error;
  }
  return err;
};

export default{
  errorHandle,
}