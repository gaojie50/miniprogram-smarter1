const pagePath = [
    {
        path: '/pages/detail/index?projectId=12345',
        name: '详情页'
    },
    {
        path: '/pages/detail/editProject/index?projectId=12345',
        name: '项目编辑页'
    },
    {
        path: '/pages/detail/searchCompany/index?projectId=12345',
        name: '搜索主控方'
    },
    {
        path: '/pages/detail/addPeople/index?projectId=12345',
        name: '搜索对接人'
    },
    {
        path: '/pages/addProject/index',
        name: '创建项目'
    },
    {
        path: '/pages/boxForecasting/index',
        name: '票房预测'
    },
    {
        path: '/pages/checkProgress/index?projectId=12345&activeTab=1',
        name: '项目进展'
    },
    {
        path: '/pages/result/index?projectId=12345&roundId=1',
        name: '评估结果页'
    },
    {
        path: '/pages/assess/index/index?projectId=12345&roundId=1',
        name: '开始评估页'
    },
    {
        path: '/pages/assess/create/index?projectId=12345',
        name: '创建评估页'
    },
    {
        path: '/pages/assess/template/index?tempId=3&projectId=12345',
        name: '评估模版预览页'
    },
    {
        path: '/pages/assess/detail/index?projectId=12345&roundId=1',
        name: '答题页'
    },
    {
        path: '/pages/searchActor/index',
        name: '搜索导演'
    },
    {
        path: '/pages/excavate/index',
        name: '项目挖掘页'
    },
    {
        path: '/pages/hotMovieSortingList/city/index?name=测试名字&projectId=12345',
        name: '各城市票房占比页'
    },
    {
        path: '/pages/coreData/index?name=测试名字&projectId=12345&isMovieScreening=true',
        name: '收入详情页'
    },
    {
        path: '/pages/coreData/realTime/index?paramIndex=1&projectId=12345&isMovieScreening=true&name=测试名字&showDate=${showDate}',
        name: '实时参数页'
    },{
        path: '/pages/coreData/fixHistory/index?projectId=12345&isMovieScreening=true&name=测试名字',
        name: '变更记录'
    },
    {
        path: '/pages/checkCity/index?fromUrl=${encodeURIComponent(path)}',
        name: '选择城市'
    },
]

export { pagePath }