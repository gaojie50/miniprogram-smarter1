export default {
  pages: [
    'pages/list/index',
    'pages/board/index',
    'pages/welcome/index',
    'pages/loginRedirect/index',
    'pages/searchProject/index',
    'pages/search/index',
    'pages/searchCompany/index',
  ],
  tabBar: {
    list: [{
      'iconPath': 'static/tab/market.png',
      'selectedIconPath': 'static/tab/market_active.png',
      pagePath: 'pages/list/index',
      text: '市场情报'
    }, {
      'iconPath': 'static/tab/board.png',
      'selectedIconPath': 'static/tab/board_active.png',
      pagePath: 'pages/board/index',
      text: '项目看板'
    }],
    custom: true
  },
  window: {
    navigationBarBackgroundColor: '#798CBA',
    backgroundTextStyle: 'light',
    navigationBarTitleText: ' ',
    navigationBarTextStyle: 'white',
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json',
  useExtendedLib: { weui: true },
  subpackages: [
    {
      root:"pages/boxForecasting",
      pages: ["index"]
    },
    {
      root: "pages/addProject",
      pages: ["index"]
    },
    {
      root: "pages/detail",
      pages: ["index", "editProject/index"]
    },
    {
      root: "pages/projectDetail",
      pages: ["index"]
    },
    {
      root: "pages/webview",
      pages: ["index"]
    },
    {
      root: "pages/checkProgress",
      pages: ["index"]
    },
    {
      root:"pages/result",
      pages:["index"]
    },
    {
      root: "pages/assess",
      pages: [ "index/index", "create/index", "template/index", "detail/index"]
    }
  ]
}