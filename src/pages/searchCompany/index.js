import {
  Block,
  View,
  Label,
  Image,
  Input,
  ScrollView,
} from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import reqPacking from '../../utils/reqPacking.js'
import utils from '../../utils/index.js'

import './index.scss'
const { debounce } = utils

class _C extends React.Component {
  state = {
    loading: false,
    inputVal: '',
    list: [],
    checked: [],
    hadItem: function (checked, id) {
      return checked.some((item) => item.id == id)
    },
  }

  fn = (e, _this) => {
    const { value } = e.detail
    const innerVal = value.trim()
    if (innerVal == '')
      return _this.setState({
        inputVal: '',
        list: [],
      })
  
      _this.setState(
      {
        loading: true,
      },
      () => {
        reqPacking({
          url: 'api/company/search',
          data: {
            keyword: innerVal,
          },
        }).then(({ success, data }) => {
          if (success && data.respList && data.respList.length > 0) {
            return _this.setState({
              inputVal: innerVal,
              loading: false,
              list: data.respList.map((item) => {
                item.checked = ''
                return item
              }),
            })
          }
  
          _this.setState({
            inputVal: innerVal,
            loading: false,
            list: [],
          })
        })
      },
    )
  };

  bindKeyInput = (e) => {
    return debounce(this.fn(e, this), 500);
  }

  touchCheckEvent = (e) => {
    const { name, id } = e.target.dataset
    const { checked, list } = this.state

    if (checked.some((item) => item.id == id)) {
      return this.setState({
        checked: checked.filter((item) => item.id != id),
        list: list.map((item) => {
          if (id == item.id) item.checked = ''
          return item
        }),
      })
    }

    checked.push({ id, name })
    this.setState({
      checked,
      list: list.map((item) => {
        if (id == item.id) item.checked = 'checked'
        return item
      }),
    })
  };

  jumpList = () =>  {
    const { checked } = this.state
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    // const eventChannel = this.getOpenerEventChannel();

    Taro.navigateBack({
      success: function (res) {
        //向list页面传递数据
        eventChannel.emit('searchPCFinish', { companyChecked: checked })
      },
    })
  };

  render() {
    const { loading, inputVal, list, checked } = this.state
    return (
      <Block>
        <View className="search-box">
          <View className="search-bar">
            <Label>
              <Image
                className="searchIco"
                src="../../static/icon/search.png"
              ></Image>
              <Input autoFocus onInput={this.bindKeyInput}></Input>
            </Label>
          </View>
        </View>
        {loading && (
          <View className="list-loading">
            <mpLoading type="circle" show={true} tips></mpLoading>
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
                  <Image src="../../static/icon/checked.png"></Image>
                  {item.name}
                </View>
              )
            })}
          </ScrollView>
        )}
        <View className="finish" onClick={this.jumpList}>
          {'完成' + (checked.length > 0 ? ' (' + checked.length + ')' : '')}
        </View>
        <View className="bottom-bg"></View>
      </Block>
    )
  }
}

export default _C
