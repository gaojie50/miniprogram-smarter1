const ENV = "dev"; // 手动切换环境服务地址 (提交审核时，务必将此处改为prod)

const ApiBaseSet = {
    //开发环境
    dev: {
      apiBase: 'https://dev.com',
      keeper: 'http://keeper.movie.st.sankuai.com',
    },

    //测试环境
    test: {
      apiBase: 'https://test.com',
      keeper: 'http://keeper.movie.st.sankuai.com',
    },

    //生产环境
    prod: {
      apiBase: 'https://prod.com',
      keeper: 'https://keeper.maoyan.com',
    }

  }

  export default {
    ENV: ENV,
    ...ApiBaseSet[ENV]
  }