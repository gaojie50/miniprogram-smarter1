export default {
  pages: [
    'pages/board/index',
    'pages/welcome/index',
    'pages/list/index',
    'pages/search/index',
    'pages/projectDetail/index',
    'pages/searchCompany/index',
    'pages/webview/index', 
    'pages/checkProgress/index',
    'pages/assess/create/index', 
    'pages/assess/template/index',
    'pages/assess/index/index',
    'pages/assess/detail/index',
  ],
  window: {
    navigationBarBackgroundColor: '#798CBA',
    backgroundTextStyle: 'light',
    navigationBarTitleText: ' ',
    navigationBarTextStyle: 'white',
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json',
  useExtendedLib: { weui: true }
}
