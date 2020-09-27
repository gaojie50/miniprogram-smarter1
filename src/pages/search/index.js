import {
  Block,
  View,
  Label,
  Image,
  Input,
  ScrollView,
  Text
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import reqPacking from '../../utils/reqPacking.js'
import utils from '../../utils/index.js'
import projectConfig from '../../constant/project-config.js'

// import MpLoading from '../../weui-miniprogram/loading/loading' TODO
import './index.scss'
const { debounce } = utils
const { getScheduleType } = projectConfig

function fn(e) {
  const { value } = e.detail
  const innerVal = value.trim()

  if (innerVal == '')
    return this.setData({
      inputVal: '',
      list: []
    })
  this.setData(
    {
      loading: true
    },
    () => {
      reqPacking({
        url: 'api/management/list',
        data: { name: innerVal },
        method: 'POST'
      }).then(({ success, data }) => {
        if (success && data && data.length > 0) {
          return this.setData({
            inputVal: innerVal,
            loading: false,
            list: data.map(item => {
              item.scheduleObj = getScheduleType(item.scheduleType)
              item.pic = item.pic
                ? `${item.pic.replace('/w.h/', '/')}@460w_660h_1e_1c`
                : `../../static/icon/default-pic.svg`

              return item
            })
          })
        }

        this.setData({
          inputVal: innerVal,
          loading: false,
          list: []
        })
      })
    }
  )
}

@withWeapp({
  data: {
    inputVal: '',
    list: [],
    loading: false
  },

  bindKeyInput: debounce(fn, 500),

  jumpDetail: function(e) {
    const { id } = e.currentTarget.dataset
    const { list } = this.data
    const filterList = JSON.parse(JSON.stringify(list)).filter(
      ({ maoyanId, projectId }) => `${maoyanId}-${projectId}` == id
    )[0]
    Taro.navigateTo({
      url: `/pages/projectDetail/index`,
      success: function(res) {
        res.eventChannel.emit('acceptDataFromListPage', {
          item: filterList
        })
      }
    })
  }
})
class _C extends React.Component {
  render() {
    const { loading, inputVal, list } = this.data
    return (
      <Block>
        <View className="search-box">
          <View className="search-bar">
            <Label>
              <Image
                className="searchIco"
                src={require('../../static/icon/search.png')}
              ></Image>
              <Input autoFocus onInput={this.bindKeyInput}></Input>
            </Label>
          </View>
        </View>
        {loading && (
          <View className="list-loading">
            {/* <MpLoading type="circle" show={true} tips></MpLoading> */}
          </View>
        )}
        {inputVal != '' && list.length == 0 && !loading && (
          <View className="no-data">暂无数据</View>
        )}
        {inputVal != '' && !loading && (
          <ScrollView className="search-list">
            {list.map((item, index) => {
              return (
                <View
                  className="item"
                  key="id"
                  data-Id={item.maoyanId + '-' + item.projectId}
                  onClick={this.jumpDetail}
                >
                  <Image src={item.pic}></Image>
                  <View className="name">{item.name}</View>
                  <View className="director">
                    {'导演：' + (item.director ? item.director : '-')}
                  </View>
                  <View className="release">
                    <Text>{item.releaseDesc ? item.releaseDesc : ''}</Text>
                    {item.movieStatus == 1 && item.reRelease && (
                      <Text
                        className="schedule-label"
                        style="background-color:rgba(19,194,194,0.1); color:rgba(19,194,194,1)"
                      >
                        重映
                      </Text>
                    )}
                    {item.movieStatus == 1 && !item.reRelease && (
                      <Text
                        className="schedule-label"
                        style={
                          'background-color:' +
                          item.scheduleObj.bgColor +
                          ';color:' +
                          item.scheduleObj.color
                        }
                      >
                        {item.scheduleObj.label}
                      </Text>
                    )}
                  </View>
                </View>
              )
            })}
          </ScrollView>
        )}
      </Block>
    )
  }
}

export default _C
