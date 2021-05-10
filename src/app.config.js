export default {
  pages: [
    'pages/list/index',
    'pages/board/index',
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
      root: 'pages/welcome',
      pages: ["index"]
    },
    {
      root:"pages/loginRedirect",
      pages: ["index"]
    },
    {
      root:"pages/searchProject",
      pages: ["index"]
    },
    {
      root:"pages/search",
      pages: ["index"]
    },
    {
      root:"pages/searchCompany",
      pages: ["index"]
    },
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
      pages: ["index", "editProject/index", "searchCompany/index", "addPeople/index"]
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
    },
    {
      root:"pages/searchActor",
      pages:["index"]
    },
    {
      root: "pages/hotMovieSortingList",
      pages: ["index/index", "city/index"]
    },
    {
      root: "pages/coreData",
      pages: ["index", "realTime/index", "fixHistory/index"]
    },
    {
      root: "pages/checkCity",
      pages: ["index"]
    }
  ]
}