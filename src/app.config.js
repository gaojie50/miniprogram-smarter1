export default {
  pages: [
    'pages/board/index',
    'pages/list/index',
    'pages/welcome/index',
    'pages/search/index',
    'pages/projectDetail/index',
    'pages/searchCompany/index',
    'pages/webview/index', 
  ],
  window: {
    navigationBarBackgroundColor: '#798CBA',
    backgroundTextStyle: 'light',
    navigationBarTitleText: ' ',
    navigationBarTextStyle: 'white'
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json',
  useExtendedLib: { weui: true }
}
