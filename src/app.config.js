export default {
  pages: [
    'pages/list/index',
    'pages/welcome/index',
    'pages/loginRedirect/index',
    'pages/searchProject/index',
    'pages/search/index',
    'pages/searchCompany/index',
  ],
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
      root: "pages/addProject",
      pages: ["index"]
    },
    {
      root: "pages/board",
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
    },
    {
      root: "pages/hotMovieSortingList",
      pages: ["index/index", "city/index"]
    },
    {
      root: "pages/coreData",
      pages: ["index", "realTime/index"]
    }
  ]
}