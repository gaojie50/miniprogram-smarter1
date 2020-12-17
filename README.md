# 智多星小程序

## 开发

```
npm install


npm run dev:weapp  

<!-- env-config.js -->
const ENV = "staging"; // 手动切换环境服务地址 (提交审核时，务必将此处改为prod)
```

## 编译配置--静态资源

图片静态资源，打包配置。

```
<!-- config/index.js -->
module.exports = {
  // ...
  copy: {
    patterns: [
      { from: 'src/static/', to: 'dist/static/', ignore: '*.js' },
    ]
  }
}

```

## 构建 

npm run build:weapp


## 持续集成

http://wxappci.maoyan.info/


appeid wx2e4c3da0429e46ce

如果有指定源错误需运行：
npm install --registry=http://r.npm.sankuai.com

如果有node-sass错误需安装：
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

！！！Taro需要全局安装

node 版本 12.14.1