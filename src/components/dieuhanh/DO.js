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
import CreateKhachHang from './component/CreateKhachHang'
import CreateThauPhu from './component/CreateThauPhu'

const Option = Select.Option;
const Promise = global.Promise;
const confirm = Modal.confirm;
const { TextArea } = Input;




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
      // console.log(props.DOTruoc)
    }
    
    let laixeObj = {}
    if(props.danhsachlaixe){
      props.danhsachlaixe.forEach(el => {
        laixeObj[el.ma] = el
      })
      laixeObj[999] = {ma: 999, ten: 'Lái Xe Thầu Phụ'}
    }

    let dongdo = [{"search":"kho dong do kho dong do","__v":0,"tinh":{"name":"Hà Nội","slug":"ha-noi","type":"thanh-pho","name_with_type":"Thành phố Hà Nội","code":"01"},"code":"Kho Đông Đô","name":"Kho Đông Đô","_id":"59c326b820a5ea164e60b978"}]
    this.state = {
      data: (props.tinhtrang >= 0 || props.edit === true) ? data : {
        lenhtruoc: props.quaydau ? props.DOTruoc._id : 0,
        doitruong:  madoitruong,
        quaydau: this.props.quaydau || false,
        tienphatsinh: 0,
        tienthu: 0,
        trongtai: 1,
        sokm: 50,
        sodiem: 1,
        thauphu: props.thauphu ? (props.quaydau ? props.DOTruoc.thauphu : 102) : 101,
        khachhang: props.quaydau ? props.DOTruoc.khachhang : props.user.ma === 1013 ? '106': '',
        nguoiyeucau: props.quaydau ? props.DOTruoc.nguoiyeucau : props.user.ma === 1013 ? '105' : '',
        xe: props.quaydau ? props.DOTruoc.xe : '',
        laixe: props.quaydau ? props.DOTruoc.laixe : '',
        tinhxuatphat: tinhObj["01"],
        tinhtrahang: tinhObj["01"],
        ghichu: '',
        date: parseInt(props.date),
        diemxuatphat: props.user.ma === 1013 ? dongdo : [],
        diemtrahang: [],
        diembatdau: 0,
        diemxanhat: 0,
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
      khachhangObj: {},
      select: []
    }

    // console.log(this.state.data.date)
    // console.log(this.state.date)


    bindAll(this, 'initThauPhu', 'changeDiemxanhat', 'changeDiembatdau', 'initKhachHang', 'changeLaiXe', 'changeTinhXuatPhat', 'changeTinh', 'changeDiemTraHang', 'changeDiemXuatPhat', 'changeNguoiYeuCau', 'changeKhachHang')

  }


  componentWillMount = async () => {
    let that = this
    const khachhang = await agent.DieuHanh.khachHang()
    let khachhangObj = {}
    if(khachhang){
      khachhang.forEach(el => {
        khachhangObj[el.code] = el
      })
    }
    const thauphu = await agent.DieuHanh.danhSachThauPhu()
    let thauphuObj = {}
    if (thauphu) {
      thauphu.forEach(el => {
        thauphuObj[el.ma] = el
      })
    }
    this.setState({
      khachhang: khachhang,
      nguoiyeucau: nguoiyeucau,
      // diemxuatphat: autofillPlace,
      khachhangObj: khachhangObj,
      thauphu: thauphu,
      thauphuObj: thauphuObj,
      init: true
    })
  }


  initThauPhu = async (el) => {
    let that = this
    const thauphu = await agent.DieuHanh.danhSachThauPhu()
    let thauphuObj = {}
    if (thauphu) {
      thauphu.forEach(el => {
        thauphuObj[el.ma] = el
      })
    }
    this.setState({
      thauphu: thauphu,
      thauphuObj: thauphuObj,
    }, () => {
      if(el){
        that.setState(prev => { return {
          ...prev,
          data: {
            ...prev.data,
            thauphu: el.ma
          }
        }})
      }
    })
  }

    initKhachHang = async () => {
    let that = this
    const khachhang = await agent.DieuHanh.khachHang()
    let khachhangObj = {}
    if(khachhang){
      khachhang.forEach(el => {
        khachhangObj[el.code] = el
      })
    }

    this.setState({
      khachhang: khachhang,
      khachhangObj: khachhangObj,
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

  changeTinhXuatPhat(value){
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          tinhxuatphat: tinhObj[value]
        }
      }
    })
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


  changeDiemxanhat(e){
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          diemxanhat: parseInt(e)
        }
      }
    })
  }

  changeDiembatdau(e){
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          diembatdau: parseInt(e)
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
    })
    const role = this.props.user.role

    let diemxanhatOption = []

    {this.state.data.diemtrahang.map((el, index) => {
      diemxanhatOption.push(<Option key={'' + index} value={'' + index}>{el.name}</Option>)
    })}

    let diembatdauOption = []
    {this.state.data.diemxuatphat.map((el, index) => {
      diembatdauOption.push(<Option key={'' + index} value={'' + index}>{el.name}</Option>)
    })}
    return (
      <div className="home-page" style={{marginTop: 0 }}>
        <div style={{padding: 5}}>
          <h2 style={{textAlign: 'center', fontSize: 24}}>Lệnh điều xe {this.state.data.quaydau && "(quay đầu)"}</h2>
          {this.state.init && <div>
            {<Row>
              <b style={{fontSize: 16}}>Ngày: </b>
              <DatePicker format="DD-MM-YYYY"
                          // disabledDate={(current) => {
                          //    return current && current.valueOf() < moment(Date.now()).add(-1, 'days');
                          // }}
                          onChange={(value) => {this.setState(prev => {
                            return {
                              ...prev,
                              data: {
                                ...prev.data,
                                date: moment(value).format('YYYYMMDD')
                              }
                            }
                          })}}
                          value={moment(this.state.data.date, 'YYYYMMDD')}
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
              <Select
                showSearch
                style={{ width: '100%' }}
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
                filterOption={(input, option) => slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0}
              >
                <Option value={'' + 1012}>Trần Văn Mỹ</Option>
                <Option value={'' + 1013}>Trần Ngọc Chỉnh</Option>
              </Select>
            </Row>
              }
              
            {((this.props.tinhtrang < 0 && this.props.thauphu) || (this.props.edit && this.state.data.thauphu !== 101)) && !this.props.quaydau && <Row>
              <b style={{fontSize: 16}}>Thầu phụ: </b>
              <Select
                showSearch
                style={{ width: '100%' }}
                value={'' + this.state.data.thauphu}
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
                filterOption={(input, option) => slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0}
              >
                {this.state.thauphu.filter((el) => {return el.ma !== 101}).map((el, index) => {
                  return <Option key={el.ma + index} value={'' + el.ma}>{el.ten}</Option>
                })}
                
              </Select>
              <div>
                <CreateThauPhu
                  handleOk={(el) => {
                    this.initThauPhu(el)
                  }}
                />
              </div>
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
            
            {this.props.tinhtrang >=0 && this.state.data.thauphu === 101 && <Row>
                <Col>
                  <b style={{fontSize: 16}}>Lái xe:</b>
                  <SelectLaiXe
                    disabled={!(intersection(role, [1002]).length > 0)}
                    option={this.state.laixe}
                    defaultValue={"" + this.state.data.laixe}
                    handleChange={this.changeLaiXe.bind(this)}
                  />
                </Col>
                <Col span={24}>
                  <b style={{fontSize: 16}}>Xe:</b>

                  {/*<AutoComplete*/}
                    {/*style={{width: '100%'}}*/}
                    {/*dataSource={this.state.danhsachxe}*/}
                    {/*value={this.state.data.xe}*/}
                    {/*onChange={(v) => {*/}
                      {/*this.setState(prev => {*/}
                        {/*return {*/}
                          {/*...prev,*/}
                          {/*data: {*/}
                            {/*...prev.data,*/}
                            {/*xe: v*/}
                          {/*}*/}
                        {/*}*/}
                      {/*})*/}
                    {/*}}*/}
                    {/*placeholder="xxX-xxxxx"*/}
                    {/*filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}*/}
                  {/*/>*/}

                  <Select
                    labelInValue value={{ key: this.state.data.xe }}
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    style={{ width: '100%' }} onChange={(e) => {
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          xe: e.key
                        }
                      }
                    })
                  }}>
                    {this.state.danhsachxe.map((el, index) => {
                      return <Option key={index} value={el}>{el}</Option>
                    })}
                  </Select>

                </Col>
            </Row>}
  
  
            {(this.props.tinhtrang === 0 || this.props.edit) && this.state.data.thauphu !== 101 &&<Row>
              <Col>
                <b style={{fontSize: 16}}>BKS:</b>

                <Input
                  value={this.state.data.xe}
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
  
  
            {((this.props.tinhtrang < 0 && !this.props.quaydau) || this.props.edit ) && <Row>

              <Col span={24} sm={12}>
                <b style={{fontSize: 16}}>Khách hàng:</b>
                <Select
                  showSearch
                  style={style}
                  value={'' + this.state.data.khachhang}
                  onChange={this.changeKhachHang}
                  filterOption={(input, option) => slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0}
                >
                  {this.state.khachhang.map((el, idx) => {
                    return <Option key={idx} value={el.code}>{el.value}</Option>
                  })}
                </Select>
                <CreateKhachHang
                  handleOk={(el) => {
                    this.initKhachHang()
                    this.setState(prev => { return {
                      ...prev,
                      data: {
                        ...prev.data,
                        khachhang: el.code
                      }
                    }})
                  }}
                />
              </Col>

              <Col span={24} sm={12}>
                <b style={{fontSize: 16}}>Người yêu cầu:</b>
                {/*<CompleteInput*/}
                {/*option={this.state.nguoiyeucau}*/}
                {/*onChange={this.changeNguoiYeuCau}*/}
                {/*/>*/}
                <Select
                  showSearch
                  style={style}
                  defaultValue={'' + this.state.data.nguoiyeucau}
                  onChange={this.changeNguoiYeuCau}
                  filterOption={(input, option) => slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0}
                >
                  {nguoiyeucau.map((el, idx) => {
                    return <Option key={idx} value={el.code}>{el.value}</Option>
                  })}
                </Select>
              </Col>

            </Row>}

  
            {(this.props.tinhtrang < 0 || this.props.edit) && <Row style={{marginTop: 10}}>

              <Col span={24} sm={12}>
                <b style={{fontSize: 16}}>Điểm đi:</b>
                <SelectPlace
                  multi={true}
                  defaultValue={this.state.data.diemxuatphat}
                  onChange = {this.changeDiemXuatPhat}
                />
              </Col>

              <Col span={24} sm={12}>
                <b style={{fontSize: 16}}>Điểm đến: ({(this.state.data.diemtrahang || []).length} điểm)</b>
                <SelectPlace
                  multi = {true}
                  defaultValue={this.state.data.diemtrahang}
                  onChange = {this.changeDiemTraHang}
                />
              </Col>
            </Row>}

            {/*{(this.props.tinhtrang < 0 || this.props.edit) && <Row style={{marginTop: 10}}>*/}
              {/*<Col span={24} sm={12}>*/}
                {/*<b style={{fontSize: 16}}>Điểm bắt đầu</b>*/}
                {/*<br/>*/}
                {/*<Select*/}
                  {/*showSearch*/}
                  {/*style={{ width: '100%' }}*/}
                  {/*value={'' + this.state.data.diembatdau}*/}
                  {/*onChange={this.changeDiembatdau}*/}
                {/*>*/}
                  {/*{diembatdauOption}*/}
                {/*</Select>*/}
              {/*</Col>*/}
              {/*<Col span={24} sm={12}>*/}
                {/*<b style={{fontSize: 16}}>Điểm trả hàng xa nhất</b>*/}
                {/*<br/>*/}
                {/*<Select*/}
                  {/*showSearch*/}
                  {/*style={{ width: '100%' }}*/}
                  {/*value={'' + this.state.data.diemxanhat}*/}
                  {/*onChange={this.changeDiemxanhat}*/}
                {/*>*/}
                  {/*{diemxanhatOption}*/}
                {/*</Select>*/}
              {/*</Col>*/}
            {/*</Row>}*/}



            {(this.props.tinhtrang < 0 || this.props.edit) && <Row style={{marginTop: 10}}>

              <Col span={24} sm={12}>
                <b style={{fontSize: 16}}>Tỉnh xuất phát:</b>
                <br/>
                <Tinh
                  defaultValue={this.state.data.tinhxuatphat ? this.state.data.tinhxuatphat.code : "01"}
                  handleChange={this.changeTinhXuatPhat}
                />
              </Col>
              <Col span={24} sm={12}>
                <b style={{fontSize: 16}}>Tỉnh trả hàng:</b>
                <br/>
                <Tinh
                  defaultValue={this.state.data.tinhtrahang ? this.state.data.tinhtrahang.code : "01"}
                  handleChange={this.changeTinh}
                />
              </Col>
            </Row>}

            {(this.props.tinhtrang < 0 || this.props.edit) && <Row style={{marginTop: 10}}>

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

            <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Ghi chú:</b>
              <Input type="textarea" rows={4}
                     defaultValue={this.state.data.ghichu}
                     onChange={(e) => {
                       let value = e.target.value
                       this.setState(prev => {
                         return {
                           ...prev,
                           data: {
                             ...prev.data,
                             ghichu: value
                           }
                         }
                       })
                     }}
              />
            </Row>
            
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
              {this.props.edit && <Button type="primary"
                                          style={{fontSize: 16}}
                                          onClick={() => {
                                            if(check(gThis.state.data)) {
                                              agent.DieuHanh.capNhapDO(gThis.state.data)
                                                .then(res => {
                                                  message.success("Cập nhập thành công")
                                                  // this.context.router.replace('/dieuhanh');
                                                  this.props.success()

                                                })
                                                .catch(err => {
                                                  message.error("Cập nhập that bai")
                                                })
                                            }
                                          }}
              >
                Cập nhập
              </Button>
              }
              
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

  if(data.tinhxuatphat === undefined || data.tinhxuatphat.name.trim().length < 1){
    message.error("Tỉnh xuất phát không được để trống")
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