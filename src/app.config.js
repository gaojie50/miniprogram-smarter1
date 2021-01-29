export default {
  pages: [
    'pages/board/index',
    'pages/welcome/index',
    'pages/list/index',
    'pages/search/index',
    'pages/projectDetail/index',
    'pages/searchCompany/index',
    'pages/webview/index', 
  ],
  window: {
    navigationBarBackgroundColor: '#798CBA',
    backgroundTextStyle: 'light',
    navigationBarTitleText: ' ',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json',
  useExtendedLib: { weui: true }
}
