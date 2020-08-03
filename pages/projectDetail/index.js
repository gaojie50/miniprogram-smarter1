Page({
  data: {
    item:{}
  },

  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', data => this.setData(data))
  },
})