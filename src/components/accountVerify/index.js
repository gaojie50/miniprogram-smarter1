import React from 'react'
import { Component } from 'react'
import Taro from '@tarojs/taro'
import { Block } from '@tarojs/components'
import reqPacking from '../../utils/reqPacking';
import utils from '@utils/index';

const { errorHandle } = utils;

const accountVerify = (WrappedComponent) => {
  return class extends Component {
    state = {
      didLogged: false
    };

    componentDidMount(){
      this.getAccountInfo();
    }
  
    getAccountInfo=()=>{
      const token = Taro.getStorageSync('token');
      if(!token){
        Taro.reLaunch({ url:'../welcome/index' })
      }

      reqPacking(
        {
          url: 'api/user/authinfo',
        }, 
        'passport'
        ).then(res => {
            const { success, data = {} } = res;
            if( !success ){
              Taro.navigateTo({
                url: '/pages/welcome/index'
              });
              return;
            }
            this.setState({didLogged: true});
          })
          .catch((err) => {
            errorHandle(err);
          });
    }

    render(){
      const { authLoading, didLogged } = this.state;
      return (
        <Block>
          {authLoading && <div style={ { position: 'relative', height: '300px' } }></div>}
          {!authLoading && didLogged && (
            <WrappedComponent { ...this.props } authLoading={ authLoading } />
          )}
        </Block>
      )
    }
  }
}

export default accountVerify;