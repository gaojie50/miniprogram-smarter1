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
      0: '接触中',
      1: '确定合作',    
      2: '正常完结',
      3: '合作暂停',
      4: '合作取消',
      5: '未合作',
    },
    rightContScrollLeft: undefined,
    listData: [],
    page: 0,
    noMore: false,
  },

  observers: {
    'list': function(list) {
      this.setData({
        page: 1,
        listData: [list.slice(0, 20)],
        noMore: false,
      })
      this.createIntersectionObserver().relativeToViewport({bottom: 200}).observe('.list-loading', (res) => {
        if(res.intersectionRect.top > 0) {
          const { page, list } = this.data;
          const noMore = page * 20 > list.length ? true : false
          this.setData({
            page: page + 1,
            ['listData[' + page + ']']: this.properties.list.slice(page * 20, page * 20 + 20),
            noMore,
          })
        }
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
      const { id, pid } = e.currentTarget.dataset
      const { list } = this.data
      const filterList = JSON.parse(JSON.stringify(list)).filter(
        ({ maoyanId, projectId }) => maoyanId == id && projectId == pid,
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
