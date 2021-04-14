# 智多星小程序

## 开发

```
node 版本 12.14.1
taro 版本 3.0.13

！！！taro全局安装  yarn global add @tarojs/cli@3.0.13
通过 taro info 查看版本号，如果不是3.0.13的话，可以卸载后再重新安装


yarn --registry=http://r.npm.sankuai.com

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
```
npm run ci-build
```

## 持续集成

http://wxappci.maoyan.info/


appeid wx2e4c3da0429e46ce


### 其他
npm安装（不推荐）
npm install --registry=http://r.npm.sankuai.com

如果有node-sass错误需安装：
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/


