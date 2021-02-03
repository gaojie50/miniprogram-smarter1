export default {
  pages: [
    'pages/welcome/index',
    'pages/list/index',
    'pages/search/index',
    'pages/projectDetail/index',
    'pages/detail/index',
    'pages/searchCompany/index',
    'pages/webview/index', 
    'pages/checkProgress/index',
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
