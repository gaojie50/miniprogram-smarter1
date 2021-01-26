export default {
  pages: [
    'pages/welcome/index',
    'pages/management/create/index', 
    'pages/list/index',
    'pages/search/index',
    'pages/projectDetail/index',
    'pages/searchCompany/index',
    'pages/webview/index', 
    'pages/management/template/index'
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
