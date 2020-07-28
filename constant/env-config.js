const ENV = "dev"; // 手动切换环境服务地址 (提交审核时，务必将此处改为prod)

const ApiBaseSet = {
    //开发环境
    dev: {
      server: "http://10.59.74.226:8080",
  	  passport: 'http://10.59.86.166:8080',
      keeper: 'http://keeper.movie.st.sankuai.com',
    },

    //测试环境
    staging: {
      server: "http://10.59.74.226:8080",
  	  passport: 'http://10.59.86.166:8080',
      keeper: 'http://keeper.movie.st.sankuai.com',
    },

    //生产环境
    prod: {
      server: "https://scweb-movie.sankuai.com",
	    passport: 'https://scauthweb-movie.sankuai.com',
      keeper: 'https://keeper.maoyan.com',
    }
  }

  export default {
    ENV: ENV,
    ...ApiBaseSet[ENV]
  }