import baseComponent from '../third/helpers/baseComponent';

baseComponent({
  properties: {
    title: {
      type: String,
      value: ''
    },
  },
  lifetimes: {
    //在组件实例进入页面节点树时执行
    attached() {
      console.log(this.properties)
    }
  }
  
})