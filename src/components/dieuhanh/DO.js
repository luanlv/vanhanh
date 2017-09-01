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
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber, Spin, DatePicker, Modal} from 'antd'

import agent from '../../agent';
import { connect } from 'react-redux';
import { List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form'
import {intersection, bindAll} from 'lodash'
import moment from 'moment'
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import CompleteInput  from '../_components/CompleteInput'
import CompleteInputValue  from '../_components/CompleteInputValue'
import CompleteInputPlace  from '../_components/CompleteInputPlace'
import CustomSelect  from '../_components/CustomSelect'
import SelectLaiXe  from '../_components/SelectLaiXe'
import {slugify} from '../_function'
import SelectPlace from './component/SelectPlace'
import 'react-select/dist/react-select.css';
import Tinh from './component/Tinh'
import tinhObj from '../tinhObj.json'

const Option = Select.Option;
const Promise = global.Promise;
const confirm = Modal.confirm;



const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  user: state.common.currentUser,
  xe: state.common.currentUser.xe
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});


const searchStyle = {
  width: '100%'
}




class DOPage extends React.Component {

  constructor(props) {
    super(props)
    
    let madoitruong = intersection(props.user.role, [101]).length > 0 ? null : props.user.ma
    
    // console.log(props.user.ma)
    let obj = {}
    props.danhsachxe.forEach(el => {
      obj[el.laixe] = el
    })
  
    const data = Object.assign({}, props.data)
    if(props.tinhtrang === 0 && props.data.thauphu !== 101){
      data.laixe = 999;
    }
    
    // const khachhang = await agent.DieuHanh.khachhang()
    // const nguoiyeucau = await agent.DieuHanh.nguoiyeucau()
    
    if(props.quaydau){
      console.log(props.DOTruoc)
    }
    
    let laixeObj = {}
    if(props.danhsachlaixe){
      props.danhsachlaixe.forEach(el => {
        laixeObj[el.ma] = el
      })
      laixeObj[999] = {ma: 999, ten: 'Lái Xe Thầu Phụ'}
    }
    let khachhangObj = {}
    if(khachhang){
      khachhang.forEach(el => {
        khachhangObj[el.code] = el
      })
    }
    
    this.state = {
      data: props.tinhtrang >= 0 ? data : {
        lenhtruoc: props.quaydau ? props.DOTruoc._id : 0,
        doitruong:  madoitruong,
        quaydau: this.props.quaydau || false,
        tienphatsinh: 0,
        tienthu: 0,
        trongtai: 1,
        sokm: 50,
        sodiem: 1,
        thauphu: props.thauphu ? (props.quaydau ? props.DOTruoc.thauphu : 102) : 101,
        khachhang: props.quaydau ? props.DOTruoc.khachhang : '',
        nguoiyeucau: props.quaydau ? props.DOTruoc.nguoiyeucau : '',
        xe: props.quaydau ? props.DOTruoc.xe : '',
        laixe: props.quaydau ? props.DOTruoc.laixe : '',
        tinhtrahang: tinhObj["01"],
        date: parseInt(moment(Date.now()).add(1, 'days').format('YYYYMMDD')),
      },
      init: false,
      khachhang: [],
      diemxuatphat: [],
      diemtrahang: [],
      nguoiyeucau: [],
      phatsinh: false,
      doixe: false,
      laixe: props.danhsachlaixe || [],
      xe: props.danhsachxe || [],
      danhsachxe: props.danhsachxe.map(el => {return el.bks}),
      xeOBJ: obj,
      laixeObj: laixeObj,
      khachhangObj: khachhangObj,
      select: []
    }
    console.log(this.state)
    bindAll(this, 'changeLaiXe', 'changeTinh', 'changeDiemTraHang', 'changeDiemXuatPhat', 'changeNguoiYeuCau', 'changeKhachHang')
  }

  componentWillMount = async () => {
    let that = this
 
    // const autofill = await agent.DieuHanh.autofill()
    // console.log(valueByField('khachhang', autofill))
    // const autofillPlace = await agent.DieuHanh.autofillPlace()
    this.setState({
      khachhang: khachhang,
      nguoiyeucau: nguoiyeucau,
      // diemxuatphat: autofillPlace,
      init: true
    })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  changeKhachHang(value) {
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          khachhang: value
        }
      }
    })
  }
  changeNguoiYeuCau(value) {
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          nguoiyeucau: value
        }
      }
    })
  }

  changeLaiXe(value) {
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          laixe: parseInt(value)
        }
      }
    })
    
    if(this.state.xeOBJ[parseInt(value)]){
      this.setState(prev => {
        return {
          ...prev,
          data: {
            ...prev.data,
            xe: this.state.xeOBJ[parseInt(value)].bks
          }
        }
      })
    }
  }
  
  changeTinh(value){
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          tinhtrahang: tinhObj[value]
        }
      }
    })
  }
  
  changeDiemXuatPhat(value){
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          diemxuatphat: value
        }
      }
    })
  }
  
  changeDiemTraHang(value){
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          diemtrahang: value
        }
      }
    })
  }


  render() {
    if(!this.state.init) return (
      <div style={{textAlign: 'center', paddingTop: 50}}>
        <Spin  size="large" tip="Đang tải..." />
      </div>
    );
    let gThis = this
    const diadiem = [];
    this.state.diemxuatphat.map((el,key) => {
      diadiem.push(<Option key={el.code}>{el.name + ' - ' + el.code}</Option>);
      // diadiem.push(<Option key={el.code}>{el.name + ' - ' + el.code + ' | ' + el.tinh.name}</Option>);
    })
    const role = this.props.user.role
    return (
      <div className="home-page" style={{marginTop: 0 }}>
        <div style={{padding: 5}}>
          <h2 style={{textAlign: 'center', fontSize: 24}}>Lệnh điều xe {this.state.data.quaydau && "(quay đầu)"}</h2>
          {this.state.init && <div>
            {this.props.tinhtrang >= 0 && <Row>
              <b style={{fontSize: 16}}>Ngày: </b>
              <DatePicker format="DD-MM-YYYY"
                          disabledDate={(current) => {
                             return current && current.valueOf() < moment(Date.now()).add(-1, 'days');
                          }}
                          onChange={(value) => {this.setState(prev => {
                            return {
                              ...prev,
                              data: {
                                ...prev.data,
                                date: moment(value).format('YYYYMMDD')
                              }
                            }
                          })}}
                          defaultValue={moment(Date.now())}
              />
            </Row>}
            
            {this.props.quaydau && <Row>
              Khách hàng: <b style={{color: 'red'}}>{this.state.khachhangObj[this.props.DOTruoc.khachhang].value}</b>
              <br/>
              Lái Xe: <b style={{color: 'red'}}>{this.state.laixeObj[this.props.DOTruoc.laixe].ten}</b>
              <br/>
              Xe: <b style={{color: 'red'}}>{this.props.DOTruoc.xe}</b>
            </Row>}
            
            {this.props.tinhtrang < 0 && intersection(role, [101]).length > 0 && <Row>
              <b style={{fontSize: 16}}>Đội trưởng:</b>
              <Select style={{ width: '100%' }}
                      onChange={(val) => {
                        this.setState(prev => {
                          return {
                            ...prev,
                            data: {
                              ...prev.data,
                              doitruong: parseInt(val)
                            }
                          }
                        })
                      }}
              >
                <Option value={'' + 1012}>Trần Văn Mỹ</Option>
                <Option value={'' + 1013}>Trần Ngọc Chỉnh</Option>
              </Select>
            </Row>
              }
              
            {this.props.tinhtrang < 0 && this.props.thauphu && !this.props.quaydau && <Row>
              <b style={{fontSize: 16}}>Thầu phụ: </b>
              <Select style={{ width: '100%' }}
                      defaultValue={'' + this.state.data.thauphu}
                      onChange={(val) => {
                        this.setState(prev => {
                          return {
                            ...prev,
                            data: {
                              ...prev.data,
                              thauphu: parseInt(val)
                            }
                          }
                        })
                      }}
              >
                {this.props.danhsachthauphu.filter((el) => {return el.ma !== 101}).map((el, index) => {
                  return <Option key={el.ma + index} value={'' + el.ma}>{el.ten}</Option>
                })}
                
              </Select>
            </Row>}
            
            { this.props.tinhtrang < 0 && (this.state.data.thauphu === 999) && <Row>
              <b style={{fontSize: 16}}>Giá chuyến: </b>
              <InputNumber
                defaultValue={this.state.data.giachuyen}
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '100%'}}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        giachuyen: value
                      }
                    }
                  })
                }}
              />
            </Row>
            }
            
            {this.props.tinhtrang >=0 && this.state.data.thauphu === 101 &&<Row>
                <Col>
                  <b style={{fontSize: 16}}>Lái xe:</b>
                  <SelectLaiXe
                    disabled={!(intersection(role, [1002]).length > 0)}
                    option={this.state.laixe}
                    handleChange={this.changeLaiXe.bind(this)}
                  />
                </Col>
                <Col span={24}>
                  <b style={{fontSize: 16}}>Xe:</b>
                  <AutoComplete
                    style={{width: '100%'}}
                    dataSource={this.state.danhsachxe}
                    value={this.state.data.xe}
                    onChange={(v) => {
                      this.setState(prev => {
                        return {
                          ...prev,
                          data: {
                            ...prev.data,
                            xe: v
                          }
                        }
                      })
                    }}
                    placeholder="xxX-xxxxx"
                    // filterOption={(inputValue, option) => {return true}}
                  />
                </Col>
            </Row>}
  
  
            {this.props.tinhtrang === 0 && this.state.data.thauphu !== 101 &&<Row>
              <Col>
                <b style={{fontSize: 16}}>BKS:</b>
                <Input
                  onChange={(e) => {
                    let value = e.target.value;
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          xe: value
                        }
                      }
                    })
                  }}
                />
              </Col>
         
            </Row>}
  
  
            {this.props.tinhtrang < 0 && !this.props.quaydau && <Row>
                <b style={{fontSize: 16}}>Khách hàng:</b>
                {/*<CompleteInput*/}
                  {/*option={this.state.khachhang}*/}
                  {/*onChange={this.changeKhachHang}*/}
                {/*/>*/}
              <Select
                style={style}
                defaultValue={'' + this.state.data.khachhang}
                onChange={this.changeKhachHang}
              >
                {khachhang.map((el, idx) => {
                  return <Option key={idx} value={el.code}>{el.value}</Option>
                })}
              </Select>
            </Row>}
            {this.props.tinhtrang < 0 && !this.props.quaydau && <Row>
                <b style={{fontSize: 16}}>Người yêu cầu:</b>
                {/*<CompleteInput*/}
                  {/*option={this.state.nguoiyeucau}*/}
                  {/*onChange={this.changeNguoiYeuCau}*/}
                {/*/>*/}
              <Select
                style={style}
                defaultValue={'' + this.state.data.nguoiyeucau}
                onChange={this.changeNguoiYeuCau}
              >
                {nguoiyeucau.map((el, idx) => {
                  return <Option key={idx} value={el.code}>{el.value}</Option>
                })}
              </Select>
            </Row>}

            {this.props.tinhtrang < 0 && <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Điểm đi:</b>
              <SelectPlace
                multi={false}
                onChange = {this.changeDiemXuatPhat}
              />
              
            </Row>}
  
  
            {this.props.tinhtrang < 0 && <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Điểm đến: ({(this.state.data.diemtrahang || []).length} điểm)</b>
              <SelectPlace
                multi = {true}
                onChange = {this.changeDiemTraHang}
              />
            </Row>}
  
            {this.props.tinhtrang < 0 && <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Tỉnh trả hàng:</b>
              <Tinh
                defaultValue={this.state.data.tinhtrahang ? this.state.data.tinhtrahang.code : "01"}
                handleChange={this.changeTinh}
              />
            </Row>}
  
            {this.props.tinhtrang < 0 && <Row style={{marginTop: 10}}>

              <Col span={24}>
                <b style={{fontSize: 16}}>Trọng tải (tấn):</b>
                <InputNumber style={{width: '100%'}} size="large"
                             value={this.state.data.trongtai}
                             min={1} max={100}
                             onChange={(value) => {
                               if(!isNaN(parseFloat(value)) || value === '') {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       trongtai: value
                                     }
                                   }
                                 })
                               } else {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       trongtai: 1
                                     }
                                   }
                                 })
                               }
                             }}
                />
              </Col>

           
            </Row>}
            
          
            
            <Row style={{marginTop: 20}}>
              {this.props.tinhtrang < 0 && <Button type="primary"
                      style={{fontSize: 16}}
                      onClick={() => {
                        if(check(gThis.state.data)) {
                          // let diemxuatphat = gThis.state.diemxuatphat[indexByCode(gThis.state.data.iddiemxuatphat, gThis.state.diemxuatphat)]
                          // let diemtrahang = []
                          // gThis.state.data.iddiemtrahang.map(code => {
                          //   diemtrahang.push(gThis.state.diemxuatphat[indexByCode(code, gThis.state.diemxuatphat)])
                          // })
                          let data = gThis.state.data
                          // data.diemtrahang = diemtrahang
                          // data.diemxuatphat = diemxuatphat
                          //
                          // console.log(gThis.state.data)
                          agent.DieuHanh.themDO(data)
                            .then(res => {
                              message.success("Thêm mới thành công")
                              // this.context.router.replace('/dieuhanh');
                              this.props.success()
                              
                            })
                            .catch(err => {
                              message.error("Thêm mới that bai")
                            })
                        }
                      }}
              >
                Tạo mới
              </Button>}
  
              {this.props.tinhtrang === 0 && <Button type="primary"
                                                   style={{fontSize: 16}}
                                                   onClick={() => {
                                                     if(checkLaiXe(gThis.state.data)) {
                                                       agent.DieuHanh.chonlaixe(gThis.state.data)
                                                         .then(res => {
                                                           message.success("Thêm mới thành công")
                                                           // this.context.router.replace('/dieuhanh');
                                                           this.props.success()
      
                                                         })
                                                         .catch(err => {
                                                           message.error("Thêm mới that bai")
                                                         })
                                                     }
                                                   }}
              >
                Chọn lái xe & xe
              </Button>}
              
            </Row>
          </div> }
        </div>
      </div>
    )
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

function checkCode(code, list){
  for(let i=0; i<list.length; i++){
    if(list[i].code == code){
      return true
    }
  }
  return false
}

function indexByCode(code, list){
  for(let i=0; i<list.length; i++){
    if(list[i].code == code){
      return i
    }
  }
  return -1
}

function check(data){
  // if(data.laixe === undefined){
  //   message.error("Chưa chọn lai xe")
  //   return false
  // }
  if(data.khachhang === undefined || data.khachhang.trim().length < 1){
    message.error("Khách hàng không được để trống")
    return false
  }
  if(data.nguoiyeucau === undefined || data.nguoiyeucau.trim().length < 1){
    message.error("Người yêu cầu không được để trống")
    return false
  }
  if(data.tinhtrahang === undefined || data.tinhtrahang.name.trim().length < 1){
    message.error("Tỉnh trả hàng không được để trống")
    return false
  }
  if(data.diemxuatphat=== undefined || data.diemxuatphat.length < 1){
    message.error("Điểm xuất phát không được để trống")
    return false
  }
  
  // if(data.tinhxuatphat === undefined || data.tinhxuatphat.trim().length < 1){
  //   message.error("Tỉnh xuất phát không được để trống")
  //   return false
  // }
  
  if(data.diemtrahang === undefined ||  data.diemtrahang.length < 1){
    message.error("Điểm trả hàng không được để trống")
    return false
  }
  
  // if(data.tinhtrahang === undefined || data.tinhtrahang.trim().length < 1){
  //   message.error("Tỉnh trả hàng không được để trống")
  //   return false
  // }
  
  if(data.trongtai === undefined || data.trongtai < 1){
    message.error("Trọng tải không được để trống")
    return false
  }
  
  // if(data.sodiem === undefined || data.sodiem < 1){
  //   message.error("Số điểm trả hàng không được để trống")
  //   return false
  // }
  if(data.sokm === undefined || data.sokm < 1){
    message.error("Số KM đi được không được để trống")
    return false
  }
  return true
}

function checkLaiXe(data){

  if(!data.laixe){
    message.error("Lái xe không được để trống")
    return false
  }
  
  if(!data.xe){
    message.error("Xe không được để trống")
    return false
  }
  
  return true
}

const style = {
  width: '100%'
}

const khachhang = [
  {code: '101', value: 'VIN'},
  {code: '102', value: 'LENSON'},
  {code: '199', value: 'Khách Lẻ'},
]

var khachhangObj = {}
if(khachhang){
  khachhang.forEach(el => {
    khachhangObj[el.code] = el
  })
}

const nguoiyeucau = [
  {code: '101', value: 'Phùng Hoài Nam'},
  {code: '102', value: 'Ngô Văn Hưng'},
  {code: '103', value: 'Nguyễn Văn Mạnh'},
  {code: '104', value: 'Trần Văn Mỹ'},
  {code: '105', value: 'Trần Ngọc Chỉnh'},
  {code: '106', value: 'Trần Ngọc Duyệt'},
  {code: '107', value: 'Đinh Thị Hưởng'},
  {code: '199', value: 'Khác'},
]

var nguoiyeucauObj = {}
if(nguoiyeucau){
  nguoiyeucau.forEach(el => {
    nguoiyeucauObj[el.code] = el
  })
}