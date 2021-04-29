import React from 'react';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import '@components/m5/style/components/action-sheet.scss';

import './index.scss';


const ActionList = function(props){
  const { isOpened=false, onClose=()=>{}, onCancel=()=>{}, actionList  } = props;
  return (
    <AtActionSheet
      className='uplaod-action-sheet'
      isOpened={isOpened}
      cancelText='取消'
      onClose={onClose}
      onCancel={onCancel}
    >
      {
        actionList.map(action=>{
          const { onClick = ()=>{}, text } = action;
          return (
            <AtActionSheetItem onClick={onClick} key={action.text}>
              {text}
            </AtActionSheetItem>
          )
        })
      }
    </AtActionSheet>
  );
}

export default ActionList;