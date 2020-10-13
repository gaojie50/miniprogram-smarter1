import {
  Block,
  View,
  Label,
  Image,
  Input,
  ScrollView
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import reqPacking from '../../utils/reqPacking.js'
import utils from '../../utils/index.js'

// import MpLoading from '../../weui-miniprogram/loading/loading' TODO
import './index.scss'
const { debounce } = utils

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
        url: 'api/company/search',
        data: {
          keyword: innerVal
        }
      }).then(({ success, data }) => {
        if (success && data.respList && data.respList.length > 0) {
          return this.setData({
            inputVal: innerVal,
            loading: false,
            list: data.respList.map(item => {
              item.checked = ''
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
    loading: false,
    inputVal: '',
    list: [],
    checked: [],
    hadItem: function(checked, id) {
      return checked.some(item => item.id == id)
    }
  },

  bindKeyInput: debounce(fn, 500),

  touchCheckEvent: function(e) {
    const { name, id } = e.target.dataset
    const { checked, list } = this.data

    if (checked.some(item => item.id == id)) {
      return this.setData({
        checked: checked.filter(item => item.id != id),
        list: list.map(item => {
          if (id == item.id) item.checked = ''
          return item
        })
      })
    }

    checked.push({ id, name })
    this.setData({
      checked,
      list: list.map(item => {
        if (id == item.id) item.checked = 'checked'
        return item
      })
    })
  },

  jumpList: function() {
    const { checked } = this.data
    const eventChannel = this.getOpenerEventChannel()

    Taro.navigateBack({
      success: function(res) {
        //向list页面传递数据
        eventChannel.emit('searchPCFinish', { companyChecked: checked })
      }
    })
  }
})
class _C extends React.Component {
  render() {
    const { loading, inputVal, list, checked } = this.data
    return (
      <Block>
        <View className="search-box">
          <View className="search-bar">
            <Label>
              <Image
                className="searchIco"
                src='../../static/icon/search.png'
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
        {!loading && (
          <ScrollView className="search-list" onClick={this.touchCheckEvent}>
            {list.map((item, index) => {
              return (
                <View
                  className={item.checked}
                  key="id"
                  data-name={item.name}
                  data-id={item.id}
                >
                  <Image src='../../static/icon/checked.png'></Image>
                  {item.name}
                </View>
              )
            })}
          </ScrollView>
        )}
        <View className="finish" ontap="jumpList">
          {'完成' + (checked.length > 0 ? ' (' + checked.length + ')' : '')}
        </View>
        <View className="bottom-bg"></View>
      </Block>
    )
  }
}

export default _C
