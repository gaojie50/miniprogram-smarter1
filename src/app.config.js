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
    'pages/management/create/index', 
    'pages/management/template/index',
    'pages/management/assessIndex/index',
    'pages/management/assessDetail/index',
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
