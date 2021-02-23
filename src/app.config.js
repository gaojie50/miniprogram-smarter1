export default {
  pages: [
    'pages/detail/editProject/index',

    'pages/welcome/index',
    'pages/board/index',
    'pages/addProject/index',
    'pages/searchProject/index',
    'pages/list/index',
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
    // {
    //   root: "pages/detail",
    //   pages: ["index", "editProject/index"]
    // },
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
      root: "pages/assess",
      pages: [ "index/index", "create/index", "template/index", "detail/index"]
    }
  ]
}