import {
  Block,
  View,
  Input,
  Text,
  Picker,
  Switch,
  Textarea,
  Button
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

@withWeapp({
  data: {
    movieType: '',
    movieType: false,
    movieTypeButton: [
      {
        type: 'primary',
        className: '',
        text: '确定',
        value: 1
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  buttontap(e) {
    console.log(e.detail)
  },
  open: function() {
    this.setData({
      movieType: true
    })
  }
})
class _C extends React.Component {
  render() {
    const { rules, formData, date } = this.data
    return (
      <View className="page">
        <View className="page__bd">
          <MpForm id="form" rules={rules} models={formData}>
            <View className="weui-cells weui-cells_after-title">
              <View className="weui-cell moviename-pack">
                <View className="asterisk">*</View>
                <Input
                  className="movieName"
                  require="true"
                  placeholder="请输入片名"
                ></Input>
              </View>
            </View>
            <View className="movie-select">
              <Text className="asterisk">*</Text>
              <View className="movie-select-type">
                <Movietype title="影片类型"></Movietype>
              </View>
            </View>
            <View className="movie-select">
              <Text className="asterisk">*</Text>
              <View className="movie-select-type">
                <Movietype title="项目状态"></Movietype>
              </View>
            </View>
            <View className="startTime">
              <Text style="margin-right: 10rpx">上映时间</Text>
              <Picker
                data-field="date"
                mode="date"
                value={date}
                start="2015-09-01"
                end="2017-09-01"
                onChange={this.bindDateChange}
              >
                <View className="startTime-pick">
                  <Text>请选择</Text>
                  <Text>可能</Text>
                </View>
              </Picker>
              <View className="weui-cell__ft">
                <Text>待定</Text>
                <Switch style="height: 30rpx; width:50rpx" checked></Switch>
              </View>
            </View>
            <View>
              <MpCell title="主出品" extClass>
                <Input
                  onInput={this.formInputChange}
                  className="weui-input"
                  placeholder="请填写1个"
                ></Input>
              </MpCell>
            </View>
            <View className="forecastBoxt">
              <MpCell title="预估票房">
                <Input
                  onInput={this.formInputChange}
                  className="weui-input"
                  placeholder="请填写"
                ></Input>
              </MpCell>
              <View className="forecastBoxt-company">亿元</View>
            </View>
            <View className="weui-cells__title">备注</View>
            <View className="weui-cells weui-cells_after-title">
              <View className="weui-cell">
                <View className="weui-cell__bd">
                  <Textarea
                    className="weui-textarea"
                    placeholder="请填写"
                    style="height: 3.3em"
                  ></Textarea>
                  <View className="weui-textarea-counter">0/200</View>
                </View>
              </View>
            </View>
          </MpForm>
          <View className="weui-btn-area">
            <Button
              className="weui-btn"
              type="primary"
              onClick={this.submitForm}
            >
              完成
            </Button>
          </View>
        </View>
      </View>
    )
  }
} // pages/add-projectInfo/add-projectInfo.js

export default _C
