import { View, Textarea, Button,  ScrollView, Label } from '@tarojs/components';
import React, { useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import AtAccordion from '@components/m5/accordion';
import AtList from '@components/m5/list';
import AtListItem from '@components/m5/list/item';
import '@components/m5/style/components/accordion.scss';
import '@components/m5/style/components/list.scss';
import '@components/m5/style/components/icon.scss';
import { pagePath } from './constants';
import { get as getGlobalData } from '../../global_data';
import './index.scss';

const capsuleLocation = getGlobalData('capsuleLocation');
const titleBarHeight = capsuleLocation.bottom;

export default function JumpCustom() {
    const [value, setValue] = useState(pagePath[0].path);
    const [name, setName] = useState(pagePath[0].name);
    const [checked, setChecked] = useState(0);
    const [open, setOpen] = useState(false);
    const [oftenSite, setOftenSite] = useState([]);

    useDidShow(() => {
      const site = Taro.getStorageSync('oftenSite');
      if(site) {
        setOftenSite(JSON.parse(site))
      }
    }) 

    return (
        <View className='jump-custom'>
            <View className='jump-custom-title'>请输入链接：</View>
            <Textarea 
              className='jump-custom-text'
              value={value} 
              onInput={e => setValue(e.detail.value)}  
              placeholder='请输入...'
              placeholderClass='place-text'
              autoHeight 
              autoFocus
            >
            </Textarea>
            <Button
              className='jump-custom-btn'
              onClick={() => {
                const filterSite = oftenSite.filter(item => item.name === name);
                const joinSite = pagePath.filter(item => item.name === name);

                if(filterSite.length === 0){
                  const path = [...oftenSite, ...joinSite];
                  Taro.setStorageSync('oftenSite', JSON.stringify(path))
                }
            
                Taro.navigateTo({
                    url: value,
                  })
                }}
            >
                跳转
            </Button>
            <ScrollView scrollY className='jump-path' style={{height: `calc(100vh - ${titleBarHeight}px - 165px)`}}>
              <AtAccordion
                open={open}
                onClick={() => setOpen(!open)}
                title='全部页面'
              >
                <AtList hasBorder={false}>
                  {
                    pagePath.map((item, index) => {
                      return <AtListItem
                        key={index}
                        title={item.name}
                        extraText={checked === index ? '已选中' : ''}
                        onClick={() => {setValue(item.path); setChecked(index); setName(item.name)}}
                        thumb={item.pic || 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'}
                      />
                    })
                  }
                </AtList>
              </AtAccordion>
              <View className='ofen-used'>
                <Label className='ofen-used-title'>常用页面：</Label> 
                {
                  oftenSite.length > 0 && oftenSite.map((item, index) => {
                    return <View
                      key={index}
                      className='ofen-used-item'
                      onClick={() => {
                        setChecked();
                        setValue(item.path);
                        setName(item.name)
                      }}
                    >
                        {item?.name}
                    </View>
                  })
                }
              </View>
            </ScrollView>
        </View>
    )
}