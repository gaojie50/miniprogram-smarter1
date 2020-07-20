const ENV = "prod"; // 手动切换环境服务地址 (提交审核时，务必将此处改为prod)

const ApiBaseSet = {
    //开发环境
    dev: {
      API_BASE: 'https://dev.com/',
    },

    //测试环境
    test: {
      API_BASE: 'https://test.com/',
    },

    //生产环境
    prod: {
      API_BASE: 'https://prod.com/',
    }

  }

  export default{
    ENV: ENV,
    ...ApiBaseSet[ENV]
  }