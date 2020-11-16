import utils from '../../utils/index.js'
const { throttle } = utils
Component({
  behaviors: [],

  properties: {
    list: {
      type: Array,
      value: [],
    },
    filterItemHidden1: Boolean,
    filterItemHidden2: Boolean,
    filterItemHidden3: Boolean,
    filterItemHidden4: Boolean,
    filterItemHidden5: Boolean,
    filterItemHidden6: Boolean,
    filterItemHidden7: Boolean,
    filterItemHidden8: Boolean,
    filterItemHidden9: Boolean,
    filterItemHidden10: Boolean,
    filterItemHidden11: Boolean,
    filterItemHidden12: Boolean,
  },
  data: {
    scheduleType: {
      1: '已定档',
      2: '非常确定',
      3: '可能',
      4: '内部建议',
      5: '待定',
    },
    project: {
      1: '筹备',
      2: '拍摄',
      3: '后期',
      4: '待过审',
      5: '已过审',
    },
    cooper: {
      1: '评估中',
      2: '跟进中',
      3: '未合作',
      4: '开发中',
      5: '投资中',
    },
    rightContScrollLeft: undefined,
    listData: [],
    page: 0,
  },

  attached: function () {
    this.createIntersectionObserver().relativeToViewport({bottom: 200}).observe('.noMore', (res) => {
      if(res.intersectionRect.top > 0) {
        const page = this.data.page;
        this.setData({
          page: page + 1,
          ['listData[' + page + ']']: this.properties.list.slice(page * 10, page * 10 + 10),
        })
      }
    })
  },
  moved: function () {
    
  },
  detached: function () {},

  observers: {
    'list': function(list) {
      this.setData({
        page: 1,
        listData: [list.slice(0, 10)],
      })
    }
  },

  methods: {
    rContScrollEvt: function ({ detail }) {
      this.setData({
        rightContScrollLeft: detail.scrollLeft,
      })
    },

    jumpToDetail: function (e) {
      const { id } = e.currentTarget.dataset
      const { list } = this.data
      const filterList = JSON.parse(JSON.stringify(list)).filter(
        ({ maoyanId, projectId }) => maoyanId == id,
      )[0]
      const { maoyanId, projectId } = filterList

      wx.navigateTo({
        url: `/pages/projectDetail/index?maoyanId=${maoyanId}&projectId=${projectId}`,
      })
    },

    rightContScroll: function (e) {
      return throttle(this.rContScrollEvt(e, this), 10)
    },
  },
})
