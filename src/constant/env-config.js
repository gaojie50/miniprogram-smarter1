const ENV = 'prod' // 手动切换环境服务地址 (提交审核时，务必将此处改为prod)

const ApiBaseSet = {
  //开发环境
  dev: {
    // server: 'http://10.59.74.226:8080',
    testServer: 'http://10.24.61.208:8080',
    server: 'https://mapi.maoyan.com/app/mock/69',
    passport: 'http://10.59.86.166:8080',
    keeper: 'http://keeper.movie.st.sankuai.com',
    mapi: 'https://mapi.maoyan.com/app/mock/69',
  },

  //测试环境
  staging: {
    // testServer: 'http://172.19.160.21:8080',
    testServer: 'http://10.24.61.208:8080',
    server: 'https://starcloud.movie.st.sankuai.com',
    mapi: 'https://mapi.maoyan.com/app/mock/69',
    passport: 'https://starcloud-user.movie.st.sankuai.com',
    keeper: 'https://keeper.maoyan.com',
  },

  //生产环境
  prod: {
    server: 'https://scweb-movie.maoyan.com',
    passport: 'https://scauthweb-movie.maoyan.com',
    keeper: 'https://keeper.maoyan.com'
  }
}

export default {
  ENV: ENV,
  ...ApiBaseSet[ENV]
}
