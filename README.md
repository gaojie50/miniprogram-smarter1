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


