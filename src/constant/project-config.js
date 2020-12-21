const appkey = 'com.sankuai.keeper.data'
const weixinAppTypeEnum = 5

function getScheduleType(value) {
  const ScheduleTypeSet = [
    {
      value: 1,
      label: '已定档',
      color: 'rgba(47,194,91,1)',
      bgColor: 'rgba(47,194,91,0.1)'
    },
    {
      value: 2,
      label: '非常确定',
      color: 'rgba(241,48,61,1)',
      bgColor: 'rgba(241,48,61,0.1)'
    },
    {
      value: 3,
      label: '可能',
      color: 'rgba(255,144,52,1)',
      bgColor: 'rgba(255,144,52,0.1)'
    },
    {
      value: 4,
      label: '内部建议',
      color: 'rgba(133,67,224,1)',
      bgColor: 'rgba(133,67,224,0.1)'
    },
    {
      value: 5,
      label: '待定',
      color: 'rgba(76,87,110,1)',
      bgColor: 'rgba(76,87,110,0.1)'
    }
  ]

  return ScheduleTypeSet.filter(item => item.value == value)[0]
}

function getMaoyanSignLabel(arr = []) {
  const MaoyanSignSet = [
    {
      value: 1,
      label: '主出'
    },
    {
      value: 2,
      label: '主发'
    },
    {
      value: 3,
      label: '联出'
    },
    {
      value: 4,
      label: '联发'
    },
    {
      value: 5,
      label: '出品'
    },
    {
      value: 6,
      label: '发行'
    }
  ]

  let produce = arr.includes(1)
    ? 1
    : arr.includes(5)
    ? 5
    : arr.includes(3)
    ? 3
    : undefined
  let release = arr.includes(2)
    ? 2
    : arr.includes(6)
    ? 6
    : arr.includes(4)
    ? 4
    : undefined

  return [produce, release]
    .filter(item => !!item)
    .map(item => MaoyanSignSet.filter(inner => inner.value == item)[0].label)
}

function getProjectStatus(value) {
  if (!value) return '-'

  const ProjectStatus = [
    {
      value: 1,
      label: '筹备'
    },
    {
      value: 2,
      label: '拍摄'
    },
    {
      value: 3,
      label: '后期'
    },
    {
      value: 4,
      label: '待过审'
    },
    {
      value: 5,
      label: '已过审'
    },
    {
      value: 6,
      label: '已上映'
    },
    {
      value: 7,
      label: '未知'
    }
  ]
  return ProjectStatus.filter(item => item.value == value)[0]
}

function getCooperStatus(value) {
  if (value === undefined) return '-'

  const CooperStatus = [
    {
      value:0,
      label:'接触中',
    },
    {
      value: 1,
      label: '确定合作'
    },
    {
      value: 2,
      label: '正常完结'
    },
    {
      value: 3,
      label: '合作暂停'
    },
    {
      value: 4,
      label: '合作取消'
    },
    {
      value: 5,
      label: '未合作'
    }
  ]

  return CooperStatus.filter(item => item.value == value)[0]
}

export default {
  appkey,
  weixinAppTypeEnum,
  getScheduleType,
  getMaoyanSignLabel,
  getProjectStatus,
  getCooperStatus
}
