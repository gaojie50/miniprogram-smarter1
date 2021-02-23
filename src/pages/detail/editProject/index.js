import React, { useState, useMemo, useEffect, useCallback, forwardRef, useRef } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '../../../utils/reqPacking.js';
import { Search, projectSearch, searchRole } from './search.js';
import Toast from '../../../components/m5/toast';
import _BasicInfo from './basicInfo';
import _KeyInfo from './keyInfo';
import './index.scss';

const KeyInfo = forwardRef(_KeyInfo);
const BasicInfo = forwardRef(_BasicInfo);
export default function EditProject() {
  const keyDataRef = useRef();
  const basicDateRef = useRef();

  const [showToast, setShowToast] = useState('');
  const [projectId, setProjectId] = useState();
  const [movieList, setMovieList] = useState({});
  const [projectInfoList, setProjectInfoList] = useState({});
  const [judgeRole, setJudgeRole] = useState({});

  useEffect(() => {
    // const url = Taro.getCurrentPages();
    // setProjectId(url[2].options.projectId)

    if(projectId !== 0) {
      Search(14347)
      .then(res => {
        setMovieList(res[0]);
      })
      projectSearch(14347)
      .then(res => {
        setProjectInfoList(res);
      })
      searchRole(14347)
      .then(res => {
        setJudgeRole(res)
      })
    }
  }, [projectId])

  const submit = useCallback(() => {
    const {name, category, t1, isOtherCategory, cooperType, customCategory, cooperStatus, type } = basicDateRef.current;
    const {scheduleType, startDate, endDate, advertisingCosts, expectBox, expectScore, myInvestment, myShare, productionCosts} = keyDataRef.current;
    console.log(keyDataRef, basicDateRef, 111)
    if (!name) {
      id.innerHTML = toast("请填写片名");
    }
    if (!t1) {
      toast("请选择品类");
    }

    if (isOtherCategory && !customCategory) {
      toast("请填写品类名称");
    }

    if (cooperType.length === 0) {
      toast("请填写意向合作类型");
    }
    if (cooperStatus === undefined) {
      toast("请填写合作状态");
    }
    reqPacking({
      url: 'api/management/editProjectInfo',
      data:{
        projectId: 14347,
        name,
        category,
        cooperStatus,
        cooperType,
        type,
        estimateBox: expectBox * 10000,
        estimateScore: +expectScore,
        cost: productionCosts * 10000,
        advertisingCost: advertisingCosts * 10000,
        share: myShare,
        investingCost: myInvestment * 10000,
        scheduleType,
        startDate,
        endDate
      },
      method: 'POST',
    })
    .then(res => {
      if(res.success) {
        wx.navigateTo({
          // url: `/pages/detail/index?projectId=${projectId}`,
        })
      }
    })
  }, [keyDataRef, basicDateRef])

  return (
    <View className="editProject">
      <BasicInfo ref={basicDateRef} movieData={movieList} projectData={projectInfoList} />
      <KeyInfo ref={keyDataRef} movieData={movieList} judgeRole={judgeRole} />
      <View className="releaseTime-submit">
          <View className="releaseTime-submit-btn" onClick={submit}>保存</View>
      </View>
    </View>
  )
}

function toast(text) {
  Taro.showToast({
    title: text,
    duration: 1000, 	
    icon: 'none',
  })
}