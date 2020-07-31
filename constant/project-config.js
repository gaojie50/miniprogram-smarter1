const appkey = 'com.sankuai.keeper.data';
const weixinAppTypeEnum = 5;

function getScheduleType(value){
  const ScheduleTypeSet = [
    {
      value: 1,
      label: '已定档',
      color: 'rgba(47,194,91,1)',
      bgColor:'rgba(47,194,91,0.1)',
    },
    {
      value: 2,
      label: '非常确定',
      color: 'rgba(241,48,61,1)',
      bgColor:'rgba(241,48,61,0.1)',
    },
    {
      value: 3,
      label: '可能',
      color: 'rgba(255,144,52,1)',
      bgColor:'rgba(255,144,52,0.1)',
    },
    {
      value: 4,
      label: '内部建议',
      color: 'rgba(133,67,224,1)',
      bgColor:'rgba(133,67,224,0.1)',
    },
    {
      value: 5,
      label: '待定',
      color: 'rgba(76,87,110,1)',
      bgColor:'rgba(76,87,110,0.1)',
    }
  ];
  return ScheduleTypeSet.filter(item => item.value == value)[0];

};

export default {
  appkey,
  weixinAppTypeEnum,
  getScheduleType,
}