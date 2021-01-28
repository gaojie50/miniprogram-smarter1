import React,{useState,useEffect} from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, Textarea, ScrollView, } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import projectConfig from '../../constant/project-config';
import './index.scss';

const {getProjectStages} = projectConfig;
const reqPacking = getGlobalData('reqPacking');

export default function AddingProcess({projectId,closeEvt,submitEvt}){
  const ProjectStages = getProjectStages();
  const [stage,setStage] = useState(1);
  const [stageStatus,setStageStatus] = useState([]);
  const [statusArr,setStatusArr] = useState([]);
  const [submit,setSubmit] = useState(false);
  const [describe,setDescribe] = useState('');
  const fetchStageDesc = () => {
    reqPacking({
      url:'api/management/stage/status/get',
      data:{projectStage:stage},
      method: 'GET',
    }).then(res => {
        const { success, data = {}, message } = res;

        if (success) return setStageStatus(data.stageStatus);

        Taro.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        });
      });
  }
  
  const changeStage = e =>{
    const { value } = e.target.dataset;
    
    if(value == stage) return ;

    setStage(value);
    setStatusArr([]);
  }  

  const setStatus = e =>{
    const { item } = e.target.dataset;
    
    setStatusArr( 
      statusArr.includes(item) ? 
      statusArr.filter(i => i != item):
      statusArr.concat(item)
    );
  }

  const submitFn = () => setSubmit(statusArr.length != 0);

  useEffect(fetchStageDesc,[stage]);
  useEffect(submitFn,[statusArr]);
  
  const goSubmit = () =>{
    if(!submit) return;

    reqPacking({
      url:'api/management/stage/save',
      data:{
        describe,
        projectId,
        projectStage:stage,
        stageStatus:statusArr,
      },
      method: 'POST',
    }).then(res => {
      const { success,error } = res;

      if (success) return submitEvt();

      Taro.showToast({
        title: error && error.message,
        icon: 'none',
        duration: 2000
      });
    });
  }

  const inputDescribe = ({detail}) => setDescribe(detail.value);

  return <View className="adding-process-wrap" >
      <View className="adding-process">
        <View className="title">添加最新进展
          <View className="close-wrap" onClick={closeEvt}>
            <Image src="../../static/close.png"/>
          </View>
        </View>
        
        <View className="cont">
          <View className='label'>项目阶段</View>
          <ScrollView scrollX>
            {ProjectStages.map(({label,value},index)=><Text 
              className={ value == stage ? `active-${value}` : '' }
              onClick={changeStage} 
              data-value={value} 
              key={index}>{label}</Text>)}
          </ScrollView>
        </View>

        <View className="cont">
          <View className='label'>阶段动作</View>
          <ScrollView scrollX className="status">
            {stageStatus.map((item,index)=><Text 
              className={ statusArr.includes(item) ? 'active' : '' }
              onClick={setStatus}
              data-item={item} 
              key={index}>{item}</Text>)}
          </ScrollView>
        </View>
        
        <Textarea
          onInput={inputDescribe}
          placeholderStyle={'color:#ccc;'}
          placeholder="添加进展描述" />

        <View 
          onClick={ goSubmit }
          className={`${submit ? 'ownPower' : ''} btn`}>提交</View>
    </View>
  </View>
}