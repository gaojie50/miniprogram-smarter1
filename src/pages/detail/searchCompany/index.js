import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Radio, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import '@components/m5/style/components/action-sheet.scss';
import util from '@utils';
import './index.scss';

const { debounce } = util;
const types = {
  mainControl: '主控方',
  producer: '出品方',
  issuer: '发行方',
}
const mainTypes = {
  producer: '主出品',
  issuer: '主发行',
}

export default function SearchCompany() {
  const [focus, setFocus] = useState(false);
  const [type, setType] = useState('producer');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstDataList, setFirstDataList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [list, setList] = useState([]);

  const [openSheet, setOpenSheet] = useState(false);
  const [openIndex, setOpenIndex] = useState();
  const [mainIndex, setMainIndex] = useState(0);
  const [radioChecked, setRadioChecked] = useState([]);
  const [searchChecked, setSearchChecked] = useState([]);

  useEffect(()=>{
    const pages =Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();

    eventChannel.on("acceptDataFromOpenerPage",(res)=>{
      if(res.type) {
        const title = types[res.type];
        Taro.setNavigationBarTitle({title});
        setType(res.type);
      }
      if(res.data) {
        const newData = res.type === 'mainControl' ? [res.data[res.type]] : res.data[res.type];

        setFirstDataList(newData || []);
        setList(newData || []);

        newData && newData.map((item, index) => {
          radioChecked.push(index);
        })
      }
    })
  },[])

  const handleSearch = debounce(e => {
    setLoading(true);
    setInputValue(e.detail.value);
    setList([]);
    requestSearch({keyword: e.detail.value})
    .then(res => {
      const { success, data, error } = res;
      if(success) {
        setSearchResult(data.respList);
        setList(data.respList)
      } else {
        wx.showToast({
          title: error.message,
          icon: 'none',
        })
      }
      setLoading(false)
    })
  })

  const selectedList = (item, index) => {
    const subChecked = inputValue === '' ? radioChecked : searchChecked;
    const select = JSON.parse(JSON.stringify(subChecked));
    const _index = select.indexOf(index);
    if(_index === -1) {
      select.push(index);
    } else {
      select.splice(_index, 1);
    }
    if(inputValue === '') {
      setRadioChecked(select);
    } else {
      setSearchChecked(select);
    }
  }

  const changeMain = () => {
    if(openIndex === 0) {
      Taro.showToast({
        title: '至少保留一个主出品',
        icon: 'none'
      })
      setOpenSheet(false);
      return
    }
    const subList = JSON.parse(JSON.stringify(list));
    const deleteItem = subList.splice(openIndex, 1);
    subList.unshift(deleteItem[0]);
    setList(subList);
    setFirstDataList(subList);
    setOpenSheet(false);
  }

  const submit = () => {
    if(inputValue !== '') {
      searchChecked.map((item) => {
        for(let i =0; i<firstDataList.length; i++) {
          if(firstDataList[i].id === list[item].id) {
            return
          }
        }

        radioChecked.push(firstDataList.length);
        firstDataList.push(list[item]);
      })

      setList(firstDataList);
      setInputValue('');
      setSearchChecked([]);
    } else {
      const newList = list.filter((item, index) => radioChecked.indexOf(index) !== -1);
      if(type === 'mainControl' && newList.length > 1) {
        Taro.showToast({
          title: '只能选择一个主控方',
          icon: 'none'
        })
        return
      }

      const pages =Taro.getCurrentPages();
      const current = pages[pages.length - 1];
      const eventChannel = current.getOpenerEventChannel();

      eventChannel.emit('submitData', type === 'mainControl' ? (newList[0] || {}) : newList)
      Taro.navigateBack()
    }
  }

  return (
    <View className="edit-search-company"> 
      <View className="edit-search-company-box">
        <View className="edit-search-company-wrap">
          <View className="edit-search-company-bar" style={{width: focus || inputValue !== '' ? '612rpx' : '690rpx'}}>
            <Image src="../../../static/icon/search.png" alt=""></Image>
            <Input value={inputValue} onInput={e => handleSearch(e)} placeholder={`搜索并添加${types[type]}`} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="edit-search-company-bar-input"></Input>
            {loading && (<View className="loading"><mpLoading type="circle" show={true} tips="" /></View>)}
            {(focus || inputValue !== '') ? <View className="cancel" onClick={()=> {setInputValue(''); setList(firstDataList);setSearchChecked([]);}}>取消</View> : null}
          </View>
        </View>
      </View>
      <ScrollView scrollY className="edit-rearch-result">
        {
          list.length > 0 && list.map((item, index) => {
            return <View className="edit-rearch-result-item" key={ index }>
              <Radio color="#F1303D" onClick={() => selectedList(item,index)} checked={(inputValue === '' && radioChecked.indexOf(index) !== -1) || (inputValue !== '' && searchChecked.indexOf(index) !== -1) ? true : ''} />
              <View className="right">
                <label className="border">
                  <Image src="https://obj.pipi.cn/festatic/common/image/29e659011b1dc61a23b6c8158c152037.png" alt=""></Image>
                  {(type !== 'mainControl') && (mainIndex === index) && (inputValue === '') ? <View className="tag">{type === 'producer' ? '主出品' : '主发行'}</View> : null} 
                </label>
                <View className="content">
                  <View className="name">{item.name}</View>
                  {/* <View className="describe"></View>
                  <View className="describe"></View> */}
                </View>
                {
                  inputValue === '' && type !== 'mainControl' ? 
                  <View className="last" onClick={() => {setOpenSheet(true);setOpenIndex(index)}}>
                    <Image src="../../../static/detail/company-edit.png" alt=""></Image>
                  </View> : null
                }
              </View>
            </View>
          })
        }
      </ScrollView>
      <AtActionSheet isOpened={openSheet} cancelText='取消' onCancel={() => setOpenSheet(false)} onClose={() => setOpenSheet(false)}>
        <AtActionSheetItem onClick={changeMain}>{openIndex === 0 ? `取消${mainTypes[type]}` : `设置为${mainTypes[type]}`}</AtActionSheetItem>
      </AtActionSheet>
      <View className="bottom-confirm">
        <View className="bottom-confirm-btn" onClick={submit}>确定（{inputValue === '' ? radioChecked.length : searchChecked.length}）</View>
      </View>
    </View>
  )
}

function requestSearch({keyword = ''}) {
  return reqPacking({
    url: 'api/company/search',
    data: {
      keyword
    }
  }).then(res => res)
}



