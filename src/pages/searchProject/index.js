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
import reqPacking from '../../utils/reqPacking.js'
import utils from '../../utils/index.js'
import projectConfig from '../../constant/project-config.js'
import { CATEGORY_LIST } from '../addProject/lib';
import { CustomName } from '../addProject/component/custom-project';
import { MovieList } from '../addProject/component/movie-list';
import Divider from '../addProject/component/divider';

import './index.scss'
const { debounce } = utils
const { getScheduleType } = projectConfig

const CATEGORY_MAPPING = {};
CATEGORY_LIST.map((item) => {
  CATEGORY_MAPPING[item.key] = item.name;
})

function fn(e, _this) {
  const { value } = e.detail
  const innerVal = value.trim()

  if (innerVal == '')
    return _this.setState({
      inputVal: '',
      list: []
    })
    _this.setState(
    {
      loading: true
    },
    () => {
      reqPacking({
        url: 'api/management/search',
        data: { keyword: innerVal, onlyProject: true },
      }).then(({ success, data }) => {
        if (success && data && data.length > 0) {
          return _this.setState({
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

        _this.setState({
          inputVal: innerVal,
          loading: false,
          list: []
        })
      })
    }
  )
}
class _C extends React.Component {
  state = {
    inputVal: '',
    list: [],
    loading: false
  }

  bindKeyInput = (e) => {
    return debounce(fn(e, this), 800);
  };

  jumpDetail = (e) => {
    const { id } = e.currentTarget.dataset;
    const { list } = this.state;
    const filterList = JSON.parse(JSON.stringify(list)).filter(
      ({ maoyanId, projectId }) => `${maoyanId}-${projectId}` == id
    )[0];
    const { maoyanId, projectId } = filterList;

    Taro.navigateTo({
      url: `/pages/detail/index?projectId=${projectId}`,
    })
  };

  render() {
    const { loading, inputVal, list } = this.state

    return (
      <View>
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
        <View style={{ marginTop: '120rpx' }}>
        {
          inputVal !== '' && (
            <>
              <CustomName value={inputVal} onChoose={() => {
              Taro.navigateTo({
                url: `/pages/addProject/index?name=${inputVal}`,

              })
            }}/>
            <Divider />
            </>
          )
        }
        {loading && (
          <View className="list-loading">
            <mpLoading type="circle" show={true} tips=""></mpLoading>
          </View>
        )}
        {inputVal != "" && (
          <>
            {list.length == 0 && !loading ? (
              <View className="no-data">暂无数据</View>
            ) : (
              <MovieList data={list} onChoose={(item) => {
                const { projectId } = item;
                Taro.navigateTo({
                  url: `/pages/detail/index?projectId=${projectId}`,
                })
              }} />
            )}
          </>
        )}
        </View>
      </View>
    );
  }
}

export default _C
