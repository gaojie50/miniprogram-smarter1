import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ScrollView, Image, Radio, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import util from '@utils';
import './index.scss';

const UserIdInfoMapper = {};
const { debounce } = util;

function formatDataSource(data = []) {
  const res = [];
  data.map(item => {
    let children = [];
    if (item.orgUserRespList) {
      children = item.orgUserRespList.map((i) => {
        UserIdInfoMapper[ i.userId ] = i;
        return ({
          title: i.realName || i.mis,
          key: i.userId,
        });
      });
    }
    if (item.orgTreeRespList) {
      children.push(...formatDataSource(item.orgTreeRespList));
    }
    if (children.length > 0) {
      res.push({
        title: item.groupName,
        key: item.groupId,
        children,
      });
    }
    return undefined;
  });
  return res;
}

function flattenData(data = []) {
  let res = [];
  data.map(item => {
    if (item.children) {
      res.push(...flattenData(item.children));
    } else {
      res.push({
        label: item.title,
        value: item.key,
        key: item.key,
      });
    }
    return null;
  });
  return res;
}

export default function AddPeople() {
  const [focus, setFocus] = useState(false);
  const [searchValue, setSearchValue ] = useState('');
  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [list, setList] = useState([]);

  const treeData = useMemo(() => {
    return formatDataSource(dataSource);
  }, [dataSource])

  const options = useMemo(() => {
    return flattenData(treeData);
  }, [treeData])

  useEffect(() => {
    const query = {
      leaderFilter: false,
    };
    reqPacking({
      url: '/api/management/org/queryorgtree',
      data: query
    })
    .then(res => {
      const { success, data, error } = res;

      if (success) {
        setDataSource([ data ]);
      } else {
        Taro.showToast({
          title: error.message,
          icon: 'node'
        })
      }
    })
  }, []);

  const handleSearch = debounce(value => {
    setLoading(true);
    setSearchValue(value);
    setList([]);

    const searchList = options.filter(i =>
      i.label.indexOf(searchValue) > -1
      || (UserIdInfoMapper[ i.value ].mis || '').indexOf(searchValue) > -1
      || (UserIdInfoMapper[ i.value ].mobile || '').indexOf(searchValue) > -1);

    setList(searchList)
    setLoading(false);
  })

  const handleSelected = useCallback((item) => {
    let projectId;
    const pages =Taro.getCurrentPages();
    pages.forEach(item => {
      if(item.route = 'pages/detail/addPeople/index') {
        projectId = item.options.projectId
      }
    })
    submitPeople(projectId, item);
  }, [])

  return (
    <View className="add-people"> 
      <View className="add-people-box">
        <View className="add-people-wrap">
          <View className="add-people-bar" style={{width: focus || searchValue !== '' ? '612rpx' : '690rpx'}}>
            <Image src="../../../static/icon/search.png" alt=""></Image>
            <Input value={searchValue} onInput={ e => handleSearch(e.detail.value) } placeholder="搜索对接人" onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="add-people-bar-input"></Input>
            {loading && (<View className="loading"><mpLoading type="circle" show={true} tips="" /></View>)}
            {focus || searchValue !== '' ? <View className="cancel" onClick={()=> {setInputValue(''); setList(firstDataList);setSearchChecked([]);}}>取消</View> : null}
          </View>
        </View>
      </View>
      <ScrollView scrollY className="edit-rearch-result">
        {
          list.length > 0 && list.map((item, index) => {
            return <View className="edit-rearch-result-item" key={ index } onClick={() => handleSelected(item)}>
              {/* <Radio color="#F1303D" onClick={() => selectedList(item,index)} checked={searchValue === '' && radioChecked.indexOf(index) !== -1} /> */}
              <View className="right">
                <label className="border">
                  <Image></Image>
                </label>
                <View className="content">
                  <View className="name">{item.label}</View>
                </View>
              </View>
            </View>
          })
        }
      </ScrollView>
    </View>
  )
}

function submitPeople(projectId, item) {
  const query = {
    projectId,
    role: 0,
    userDesc: '',
    userId: item. value
  }

  reqPacking({
    url: '/api/management/user/save',
    data: query,
    method: 'POST'
  })
  .then(res => {
    const { success, error } = res;
    if(success) {
      Taro.navigateBack();
    } else {
      Taro.showToast({
        title: error.message,
        icon: 'none',
      })
    }

  })
}


