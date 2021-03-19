import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Radio, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import './index.scss';

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
        const title = res.type === 'producer' ? '出品方' : '发行方';
        Taro.setNavigationBarTitle({title});
        setType(res.type);
      }
      if(res.data) {
        setFirstDataList(res.data[res.type]);
        setList(res.data[res.type]);
        res.data[res.type].map((item, index) => {
          radioChecked.push(index);
        })
      }
    })
  },[])

  const handleSearch = e => {
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
  }

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
    
        firstDataList.push(list[item]);
        radioChecked.push(radioChecked.length);
      })

      setList(firstDataList);
      setInputValue('');
      setSearchChecked([]);
    } else {
      const pages =Taro.getCurrentPages();
      const current = pages[pages.length - 1];
      const eventChannel = current.getOpenerEventChannel();
      const newList = list.filter((item, index) => radioChecked.indexOf(index) !== -1);

      eventChannel.emit('submitData', newList)
      Taro.navigateBack()
    }
  }

  return (
    <View className="edit-search-company"> 
      <View className="edit-search-company-box">
        <View className="edit-search-company-wrap">
          <View className="edit-search-company-bar" style={{width: focus || inputValue !== '' ? '612rpx' : '690rpx'}}>
            <Image src="../../../static/icon/search.png" alt=""></Image>
            <Input value={inputValue} onInput={e => handleSearch(e)} placeholder={type === 'producer' ? '搜索并添加出品方' : '搜索并添加发行方'} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="edit-search-company-bar-input"></Input>
            {loading && (<View className="loading"><mpLoading type="circle" show={true} tips="" /></View>)}
            {focus || inputValue !== '' ? <View className="cancel" onClick={()=> {setInputValue(''); setList(firstDataList);setSearchChecked([]);}}>取消</View> : null}
          </View>
        </View>
      </View>
      <ScrollView scrollY className="edit-rearch-result">
        {
          list.length > 0 && list.map((item, index) => {
            return <View className="edit-rearch-result-item" key={ index }>
              <Radio color="#F1303D" onClick={() => selectedList(item,index)} checked={inputValue === '' && radioChecked.indexOf(index) !== -1} />
              <View className="right">
                <label className={(mainIndex === index) && (inputValue === '') ? "border main" : "border"}>
                  <Image></Image>
                </label>
                <View className="content">
                  <View className="name">{item.name}</View>
                  {/* <View className="describe"></View>
                  <View className="describe"></View> */}
                </View>
                {
                  inputValue === '' ? 
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
        <AtActionSheetItem onClick={changeMain}>{openIndex === 0 ? '取消主出品' : '设置为主出品'}</AtActionSheetItem>
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



