const CATEGORY_LIST = [ {
  key: 1,
  name: '网络剧'
},
{
  key: 2,
  name: '电视剧'
},
{
  key: 3,
  name: '院线电影'
},
{
  key: 4,
  name: '网络电影'
},
];

const YEAR_TYPE_LIST = [
  {
    key: 1,
    name: '新时代',
    detail: '（2008-至今）'
  }, {
    key: 2,
    name: '当代',
    detail: '（1978-2008）'
  }, {
    key: 3,
    name: '现代',
    detail: '（1949-1978）'
  }, {
    key: 4,
    name: '近代',
    detail: '（1911-1949）'
  }, {
    key: 5,
    name: '古代',
    detail: '（1911年以前）'
  }, {
    key: 6,
    name: '未来',
    detail: ''
  }, {
    key: 7,
    name: '跨时代',
    detail: ''
  }
];

const GENDER_LIST = [
  {
    key: 0,
    name: '全部'
  },
  {
    key: 1,
    name: '男'
  }, {
    key: 2,
    name: '女'
  }
];
const AGE_LIST = [
  {
    key: 0,
    name: '全年龄段'
  }, {
    key: 1,
    name: '16岁以下'
  }, {
    key: 2,
    name: '16-25'
  }, {
    key: 3,
    name: '26-45'
  }, {
    key: 4,
    name: '45以上'
  },
];

const MOVIE_TYPE_LIST = [
  {
    key: 1,
    name: '剧情'
  }, {
    key: 2,
    name: '喜剧'
  }, {
    key: 3,
    name: '爱情'
  }, {
    key: 4,
    name: '动画'
  }, {
    key: 5,
    name: '动作'
  }, {
    key: 6,
    name: '恐怖'
  }, {
    key: 7,
    name: '惊悚'
  }, {
    key: 8,
    name: '悬疑'
  }, {
    key: 9,
    name: '冒险'
  }, {
    key: 10,
    name: '科幻'
  }, {
    key: 11,
    name: '犯罪'
  }, {
    key: 12,
    name: '战争'
  }, {
    key: 13,
    name: '奇幻'
  }, {
    key: 14,
    name: '运动'
  }, {
    key: 15,
    name: '家庭'
  }, {
    key: 16,
    name: '武侠'
  }, {
    key: 17,
    name: '西部'
  }, {
    key: 18,
    name: '历史'
  }, {
    key: 19,
    name: '传记'
  }, {
    key: 20,
    name: '歌舞'
  }, {
    key: 21,
    name: '黑色电影'
  }, {
    key: 22,
    name: '短片'
  }, {
    key: 23,
    name: '戏曲'
  }, {
    key: 24,
    name: '音乐'
  }, {
    key: 25,
    name: '灾难'
  }, {
    key: 26,
    name: '真人秀'
  }, {
    key: 27,
    name: '脱口秀'
  }, {
    key: 28,
    name: '游戏秀'
  }, {
    key: 29,
    name: '舞台艺术'
  }, {
    key: 30,
    name: '纪录片'
  }, {
    key: 31,
    name: '青春'
  }, {
    key: 32,
    name: '动漫'
  }, {
    key: 33,
    name: '儿童'
  }
];

const TV_TYPE_LIST = [
  {
    key: 1,
    name: '情景喜剧'
  }, {
    key: 2,
    name: '轻喜剧'
  }, {
    key: 3,
    name: '武侠'
  }, {
    key: 4,
    name: '动作'
  }, {
    key: 5,
    name: '武打'
  }, {
    key: 6,
    name: '玄幻'
  }, {
    key: 7,
    name: '奇幻'
  }, {
    key: 8,
    name: '神话'
  }, {
    key: 9,
    name: '穿越'
  }, {
    key: 10,
    name: '古装'
  }, {
    key: 11,
    name: '历史'
  }, {
    key: 12,
    name: '宫廷权谋'
  }, {
    key: 13,
    name: '断案'
  }, {
    key: 14,
    name: '传记'
  }, {
    key: 15,
    name: '传奇'
  }, {
    key: 16,
    name: '纪录'
  }, {
    key: 17,
    name: '年代'
  }, {
    key: 18,
    name: '革命'
  }, {
    key: 19,
    name: '战争'
  }, {
    key: 20,
    name: '谍战'
  }, {
    key: 21,
    name: '伟人'
  }, {
    key: 22,
    name: '军旅'
  }, {
    key: 23,
    name: '现代'
  }, {
    key: 24,
    name: '开垦'
  }, {
    key: 25,
    name: '都市'
  }, {
    key: 26,
    name: '行业'
  }, {
    key: 27,
    name: '官场'
  }, {
    key: 28,
    name: '职场'
  }, {
    key: 29,
    name: '家庭'
  }, {
    key: 30,
    name: '伦理'
  }, {
    key: 31,
    name: '家族'
  }, {
    key: 32,
    name: '涉案'
  }, {
    key: 33,
    name: '青春'
  }, {
    key: 34,
    name: '偶像'
  }, {
    key: 35,
    name: '校园'
  }, {
    key: 36,
    name: '青少'
  }, {
    key: 37,
    name: '运动'
  }, {
    key: 38,
    name: '电竞'
  }, {
    key: 39,
    name: '爱情'
  }, {
    key: 40,
    name: '农村'
  }, {
    key: 41,
    name: '科幻'
  }, {
    key: 42,
    name: '冒险'
  }, {
    key: 43,
    name: '悬疑'
  }, {
    key: 44,
    name: '动画'
  }, {
    key: 45,
    name: '动漫'
  }, {
    key: 46,
    name: '纪录片'
  }
];
const VARIETY_TYPE_LIST = [
  {
    key: 1,
    name: "真人秀"
  },
  {
    key: 2,
    name: "脱口秀"
  },
  {
    key: 3,
    name: "爱情"
  },
  {
    key: 4,
    name: "历史"
  },
  {
    key: 5,
    name: "冒险"
  },
  {
    key: 6,
    name: "时尚"
  },
  {
    key: 7,
    name: "家庭"
  },
  {
    key: 8,
    name: "歌舞"
  },
  {
    key: 9,
    name: "竞技"
  },
  {
    key: 10,
    name: "悬疑"
  },
  {
    key: 11,
    name: "音乐"
  },
  {
    key: 12,
    name: "生活"
  },
  {
    key: 13,
    name: "游戏"
  },
  {
    key: 14,
    name: "纪录片"
  },
  {
    key: 15,
    name: "晚会"
  },
  {
    key: 16,
    name: "选秀"
  },
  {
    key: 17,
    name: "搞笑"
  },
  {
    key: 18,
    name: "美食"
  },
  {
    key: 19,
    name: "访谈"
  },
  {
    key: 20,
    name: "旅游"
  },
  {
    key: 21,
    name: "网络综艺"
  },
  {
    key: 22,
    name: "文化"
  },
  {
    key: 23,
    name: "益智"
  },
];

export {
  CATEGORY_LIST,
  YEAR_TYPE_LIST,
  GENDER_LIST,
  AGE_LIST,
  MOVIE_TYPE_LIST,
  TV_TYPE_LIST,
  VARIETY_TYPE_LIST
};