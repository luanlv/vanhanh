/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber, Switch, Modal, Radio} from 'antd'
import moment from 'moment';
import { Link } from 'react-router'
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  APP_LOAD
} from '../../constants/actionTypes';

import CompleteInput  from '../_components/CompleteInput'
import CompleteInputValue  from '../_components/CompleteInputValue'
import CompleteInputPlace  from '../_components/CompleteInputPlace'
import CustomSelect  from '../_components/CustomSelect'
// import CompleteInput  from './component/Complete'

import {slugify} from '../_function'

const Option = Select.Option;
const Promise = global.Promise;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  xe: state.common.currentUser.xe,
  do: state.common.currentUser.do
});

const mapDispatchToProps = dispatch => ({
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),
  reloadInfo: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
});


class DOPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      init: false,
      data: {},
      khachhang: [],
      diemxuatphat: [],
      diemtrahang: [],
      nguoiyeucau: [],
      visible: false,
      visible2: false,
      edit: false,
      bks: this.props.xe.bks,
      khongnhan: false,
      lydohuy: '',
      data2: {
        giaohang: 'a',
        tienthu: 0,
        tienphatsinh: 0,
        lydo: ''
      },
    }
  }

  componentWillMount() {
    let that = this;
    agent.LaiXe.DObyId(this.props.params.id)
      .then(res => {
        let DO = res[0]
        that.setState(prev => { return {
          ...prev,
          init: true,
          data: DO
        }})
      })
      .catch(err => {
      
      })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
   showModal2 = () => {
    this.setState({
      visible2: true,
    });
  }
  
  handleOk = (e) => {
    // console.log(e);
    // this.setState({
    //   visible: false,
    // });
    let that = this;
    console.log(this.props.params.id)
    if(this.state.khongnhan) {
      agent.LaiXe.huyDO({do: this.props.params.id, lydohuy: this.state.lydohuy})
        .then(res => {
          const token = window.localStorage.getItem('jwt');
          if (token) {
            agent.setToken(token);
          }
          this.props.reloadInfo(agent.Auth.current());
          message.success("Hủy thành công")
          this.context.router.replace('/laixe/do')
        })
        .catch(err => {
          message.error("Có lỗi")
        })
      
    } else {
      agent.LaiXe.nhanDO({do: this.props.params.id, bks: that.state.bks})
        .then(res => {
          this.context.router.replace('/laixe/do/dangdi');
          message.success("Xác nhận thành công")
          this.context.router.replace('/laixe/do')
        })
        .catch(err => {
          message.error("Có lỗi")
        })
    }
    
  }
  
  handleOk2 = (e) => {
    let that = this;
    agent.LaiXe.ketthucDO({do: this.props.params.id, tienthu: that.state.data2.tienthu, tienphatsinh: that.state.data2.tienphatsinh, lydo: that.state.data2.lydo, giaohang: that.state.data2.giaohang})
      .then(res => {
        message.success("Thành công")
        const token = window.localStorage.getItem('jwt');
        if (token) {
          agent.setToken(token);
        }
        this.props.reloadInfo(agent.Auth.current());
        this.context.router.replace('/laixe')
      })
      .catch(err => {
        message.error("Có lỗi")
      })
  }
  
  handleCancel = (e) => {
    this.setState({
      visible: false,
      visible2: false,
    });
  }

  handleCancel2 = (e) => {
    this.setState({
      visible: false,
      visible2: false,
    });
  }

  render() {
    let gThis = this
    if(!this.state.init){
      return (
        <div className="do-page">
          <div className="laixe-doWr">
          </div>
        </div>)
    } else {
      console.log(gThis.state.data)
        return (
          <div className="home-page" >
            <div style={{padding: '0.2rem', paddingBottom: '2rem'}}>
              <h2 className="textCenter" style={{fontSize: '1rem'}}>Lệnh điều xe</h2>
              <div style={{fontSize: '0.4rem'}}>
              Mã lệnh: <b style={{color: 'red'}}>{'DO' + (this.state.data._id + 10000)}</b>
              <br/>
              Ngày: <b>{moment(this.state.data.time).format('DD/MM/YYYY')}</b>
              <br/>
              
              Khách hàng : <b>{this.state.data.khachhang}</b>
              <br/>
              
              <span> Người yêu cầu: </span><b>{this.state.data.nguoiyeucau}</b>
              <br/>
              
              <span > Điểm xuất phát : </span>
                <br/>
                - <b >{this.state.data.diemxuatphat.name} | {this.state.data.diemxuatphat.tinh.name}</b>
              <br/>
              
              <span > Điểm trả hàng: <b>{this.state.data.diemtrahang.length}</b> điểm</span>
                <b >
                  {this.state.data.diemtrahang.map((el,index) => {
                    return <div>[{index + 1}] - {el.name} | {el.tinh.name}</div>
                  })}
                </b>
                Trọng tải: <b >{this.state.data.trongtai} tấn</b>
              </div>
              
              {/*<div>*/}
                {/*<span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số điểm </span><b style={{fontSize: '0.6rem'}}>{this.state.data.sodiem}</b>*/}
              {/*</div>*/}
              
              {/*<div>*/}
                {/*<span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Quãng đường : </span><b style={{fontSize: '0.6rem'}}>{this.state.data.sokm} KM</b>*/}
              {/*</div>*/}
              
              {/*<div>*/}
                {/*<span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số tiền thu : </span><b style={{fontSize: '0.6rem'}}>{this.state.data.tienthu.toLocaleString() } đ</b>*/}
              {/*</div>*/}
              {/*<div>*/}
                {/*<span style={{width: 280, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Trạng thái : </span>*/}
                {/*<b>*/}
                  {/*{!this.state.data.trangthai.daduyet ? ("Đang xử lý") : (this.state.data.trangthai.duyet ? ("Đồng ý") : ("Hủy"))}*/}
                {/*</b>*/}
              {/*</div>*/}
              
            </div>
            {this.state.data.tinhtrang === 0 && <Row style={{ position: 'fixed', bottom: 0, left: 0, right: 0}}>
              <Button type="primary"
                      style={{width: '50%', height: '1.5rem', fontSize: '0.6rem'}}
                      // onClick={() => {
                      //   if(check(gThis.state.data)){
                      //     agent.LaiXe.capnhapDO(gThis.state.data)
                      //       .then(res => {
                      //         message.success("Cập nhập thành công")
                      //       })
                      //       .catch(err => {
                      //         message.error("Cập nhập thất bại")
                      //       })
                      //   }
                      //
                      // }}
                      onClick={() => this.setState({visible: true, khongnhan: false})}
              >Nhận lệnh</Button>
              <Button type="danger" className="huyButton"
                      style={{width: '50%', height: '1.5rem', fontSize: '0.6rem'}}
                      onClick={() => {
                        this.setState(prev => {return {
                          ...prev,
                          visible: true,
                          khongnhan: true,
                        }})
                      }}
              >Hủy lệnh</Button>
            </Row>}
            
            {this.state.data.tinhtrang === 1 && <Row style={{ position: 'fixed', bottom: 0, left: 0, right: 0}}>
                <Button type="primary"
                        style={{width: '100%', height: '1.5rem', fontSize: '0.6rem'}}
                        onClick={this.showModal2}
                >Kết thúc</Button>
            </Row>
            }
            
            <Modal
              visible={this.state.visible}
              title={!this.state.khongnhan ? "Chọn xe chờ hàng" : "Hủy lệnh điều xe"}
              maskClosable={true}
              // onOk={this.handleOk}
              // onCancel={this.handleCancel}
              footer={[
                <Button key="back" size="large" onClick={() => this.handleCancel()}>Quay lại</Button>,
                <Button key="submit" type="primary" size="large" onClick={this.handleOk}>Xác nhận</Button>,
              ]}
              className={!this.state.khongnhan ? "chonxe" : ""}
            >
              {this.state.khongnhan ? (<div>
                <b style={{fontSize: '1.2rem'}}>Lý do</b>
                <Input type="textarea" rows={4} style={{width: '100% !important', height: '3rem !important', lineHeight: '1rem', fontSize: '0.5rem'}}
                       onChange={(value) => {
                         this.setState(prev => {
                           return {
                             ...prev,
                             data: {
                               ...prev.data,
                               lydohuy: value
                             }
                           }
                         })
                       }}
                />
              </div>) : (
                <div>
                  {!this.state.edit && <div className="bks"
                                            onClick={() => this.setState({edit: true})}
                  >{this.props.xe.bks}</div>}
                  {this.state.edit && <Input
                    type="text"
                    defaultValue={this.state.bks}
                    onChange={(e) => {
                      let value = e.target.value
                      this.setState(prev => {return {
                        ...prev,
                        bks: value
                      }})
                    }}
                  />}
                </div>
              )}
              
            </Modal>
  
            <Modal
              visible={this.state.visible2}
              title="Kết thúc chuyến đi"
              maskClosable={true}
              // onOk={this.handleOk}
              // onCancel={this.handleCancel}
              footer={[
                <Button key="back" size="large" onClick={() => this.handleCancel2()}>Quay lại</Button>,
                <Button key="submit" type="primary" size="large" onClick={this.handleOk2}>Xác nhận</Button>,
              ]}
            >
              <div>
                <RadioGroup defaultValue="a" size="large"
                  onChange={(e) => {
                    let value = e.target.value;
                    this.setState(prev => {
                      return {
                        ...prev,
                        data2: {
                          ...prev.data2,
                          giaohang: value
                        }
                      }
                    })
                  }}
                >
                  <RadioButton value="a">Giao đủ hàng</RadioButton>
                  <RadioButton value="b">Điều rỗng</RadioButton>
                  <RadioButton value="c">Hủy chuyến</RadioButton>
                </RadioGroup>
              </div>
              <b style={{fontSize: '0.7rem'}}>Tiền thu hộ</b>
              <InputNumber style={{width: '100%'}} size="large"
                           defaultValue={0}
                           min={0}
                           formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                           parser={value => value.replace(/(,*)/g, '')}
                           onChange={(value) => {
                             if(!isNaN(parseFloat(value)) || value === '') {
                               this.setState(prev => {
                                 return {
                                   ...prev,
                                   data2: {
                                     ...prev.data2,
                                     tienthu: value
                                   }
                                 }
                               })
                             } else {
                               this.setState(prev => {
                                 return {
                                   ...prev,
                                   data2: {
                                     ...prev.data2,
                                     tienthu: 1
                                   }
                                 }
                               })
                             }
                           }}
              />
              { !this.state.phatsinh && <Button type="primary" ghost={true} style={{width: '3rem !important', fontSize: '0.4rem'}}
                                                onClick={() => {
                                                  this.setState(prev => {return {
                                                    ...prev,
                                                    phatsinh: true
                                                  }})
                                                }}
              >Phí phát sinh</Button>}
    
              {this.state.phatsinh && <div>
                <b style={{fontSize: '0.7rem'}}>Phí phát sinh</b>
                <InputNumber style={{width: '100%'}} size="large"
                             defaultValue={0}
                             min={0}
                             formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                             parser={value => value.replace(/(,*)/g, '')}
                             onChange={(value) => {
                               if(!isNaN(parseFloat(value)) || value === '') {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data2: {
                                       ...prev.data2,
                                       tienphatsinh: value
                                     }
                                   }
                                 })
                               } else {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data2: {
                                       ...prev.data2,
                                       tienphatsinh: 1
                                     }
                                   }
                                 })
                               }
                             }}
                />
                <Input type="textarea" rows={4} style={{width: '100% !important', height: '3rem !important', lineHeight: '1rem', fontSize: '0.5rem'}}
                       onChange={(value) => {
                         this.setState(prev => {
                           return {
                             ...prev,
                             data2: {
                               ...prev.data2,
                               lydo: value
                             }
                           }
                         })
                       }}
                />
              </div>}
            </Modal>
            
          </div>
        )
    }
  }

}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(DOPage);

function valueByField(fieldName, list){
  for(let i= 0; i < list.length; i++){
    if(list[i]._id === fieldName){
      return list[i].list
    }
  }
  return []
}

function codeByValue(value, list){
  for(let i=0; i<list.length; i++){
    if(list[i].value === value){
      return list[i].code
    }
  }
  return ''
}

function check(data){
  if(data.khachhang === undefined || data.khachhang.trim().length < 1){
    message.error("Khách hàng không được để trống")
    return false
  }
  if(data.nguoiyeucau === undefined || data.nguoiyeucau.trim().length < 1){
    message.error("Người yêu cầu không được để trống")
    return false
  }
  if(data.xe.bks === undefined || data.xe.bks.trim().length < 1){
    message.error("Chưa chọn xe")
    return false
  }
  if(data.diemxuatphat=== undefined || data.diemxuatphat.trim().length < 1){
    message.error("Điểm xuất phát không được để trống")
    return false
  }
  if(data.tinhxuatphat === undefined || data.tinhxuatphat.trim().length < 1){
    message.error("Tỉnh xuất phát không được để trống")
    return false
  }
  if(data.diemtrahang === undefined ||  data.diemtrahang.trim().length < 1){
    message.error("Điểm trả hàng không được để trống")
    return false
  }
  if(data.tinhtrahang === undefined || data.tinhtrahang.trim().length < 1){
    message.error("Tỉnh trả hàng không được để trống")
    return false
  }
  if(data.trongtai === undefined || data.trongtai < 1){
    message.error("Trọng tải không được để trống")
    return false
  }
  if(data.sodiem === undefined || data.sodiem < 1){
    message.error("Số điểm trả hàng không được để trống")
    return false
  }
  // if(data.sokm === undefined || data.sokm < 1){
  //   message.error("Số KM đi được không được để trống")
  //   return false
  // }
  return true
}
