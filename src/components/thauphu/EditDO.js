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
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
const Option = Select.Option;
import moment from 'moment';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
// import CompleteInput  from './component/Complete'

import {slugify} from '../_function'

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class CompleteInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: {},
      dataSource: [],
      option : props.option || []
    }
  }

  handleSearch = (value) => {
    let newOption = this.state.option.filter(option => {
      return slugify(option.toLowerCase()).indexOf(slugify(value.toLowerCase())) >= 0
    })

    this.setState({
      dataSource: !value ? [] : newOption.slice(0, 5)
    });

  }

  render() {
    const { dataSource } = this.state;
    return (
      <AutoComplete
        dataSource={dataSource}
        defaultValue={this.props.defaultValue}
        style={{ width: '100%' }}
        onChange={(value) => this.props.onChange(value)}
        onSearch={this.handleSearch}
      />
    );
  }

}

class DOPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      edit: true,
      init: false,
      data: {}
    }
  }

  componentWillMount() {
    let that = this;
    agent.LaiXe.DObyId(this.props.params.id)
      .then(res => {
        let DO = res[0]
        that.setState(prev => { return {
          ...prev,
          edit: (moment(DO.timeEdit).diff(moment(Date.now())) > 0),
          init: true,
          data: DO
        }})
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentWillUnmount() {
    this.props.onUnload();
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
      if(!this.state.edit) {
        return (
          <div className="do-page">
            <div className="laixe-doWr">
              <h2 className="mt10 mt20 textCenter">Lệnh điều động xe</h2>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Mã DO: </span><b>{'DO' + (this.state.data._id + 10000)}</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Khách hàng : </span><b>{this.state.data.khachhang}</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Điểm xuất phát : </span><b>{this.state.data.diemxuatphat}</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Điểm trả hàng : </span><b>{this.state.data.diemtrahang}</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Người yêu cầu : </span><b>{this.state.data.nguoiyeucau}</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Trọng tải : </span><b>{this.state.data.trongtai} tấn</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số điểm trả hàng : </span><b>{this.state.data.diemtrahang}</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Quãng đường : </span><b>{this.state.data.sokm} KM</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số tiền thu : </span><b>{this.state.data.tienthu } VNĐ</b>
              </div>
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Người duyệt : </span><b>Đang xử lý</b>
              </div>
            </div>
          </div>
        )
      }
      return (
        <div className="do-page">
          <div className="laixe-doWr">
            <h2 style={{textAlign: 'center'}}>Lệnh điều động xe ô tô</h2>
            <div>
              <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Mã DO: </span><b>{'DO' + (this.state.data._id + 10000)}</b>
            </div>
            <Row>
              Khách hàng:
              <CompleteInput
                option={[
                  "KH1 - Khách hàng 1",
                  "KH2 - Khách hàng 2",
                  "KH3 - Khách hàng 3"
                ]}
                defaultValue={this.state.data.khachhang}
                onChange={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        khachhang: value
                      }
                    }
                  })
                }}
              />

            </Row>
            <Row style={{marginTop: 10}}>
              Điểm xuất phát:
              <CompleteInput
                option={[
                  "VSIP - Vsip Bắc Ninh",
                  "NH - Ngọc Hồi"
                ]}
                defaultValue={this.state.data.diemxuatphat}
                onChange={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        diemxuatphat: value
                      }
                    }
                  })
                }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              Điểm trả hàng:
              <CompleteInput
                option={[
                  "VSIP - Vsip Bắc Ninh",
                  "NH - Ngọc Hồi"
                ]}
                defaultValue={this.state.data.diemtrahang}
                onChange={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        diemtrahang: value
                      }
                    }
                  })
                }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              Người yêu cầu:
              <CompleteInput
                option={[
                  "Mạnh",
                  "Nam",
                  "Huởng"
                ]}
                defaultValue={this.state.data.nguoiyeucau}
                onChange={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        nguoiyeucau: value
                      }
                    }
                  })
                }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              Trọng tải (tấn):
              <CompleteInput
                option={[
                  "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3"
                ]}
                defaultValue={this.state.data.trongtai}
                onChange={(value) => {
                  if (parseFloat(value).isNaN) {
                    value = 0;
                  }
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        trongtai: parseFloat(value)
                      }
                    }
                  })
                }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              Số điểm trả hàng:
              <InputNumber style={{width: '100%'}} size="large" min={1} max={1000}
                           defaultValue={this.state.data.sodiem}
                           onChange={(value) => {
                             this.setState(prev => {
                               return {
                                 ...prev,
                                 data: {
                                   ...prev.data,
                                   sodiem: value
                                 }
                               }
                             })
                           }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              Số KM:
              <InputNumber style={{width: '100%'}} size="large" min={1} max={100}
                           defaultValue={this.state.data.sokm}
                           onChange={(value) => {
                             this.setState(prev => {
                               return {
                                 ...prev,
                                 data: {
                                   ...prev.data,
                                   sokm: value
                                 }
                               }
                             })
                           }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              Số Tiền Thu:
              <InputNumber
                defaultValue={this.state.data.tienthu}
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '100%'}}
                onChange={(value) => {
                  if (parseInt(value).isNaN) {
                    value = 0;
                  }
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        tienthu: value
                      }
                    }
                  })
                }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              <Button type="primary"
                      onClick={() => {
                        console.log(gThis.state.data)
                        agent.LaiXe.capnhapDO(gThis.state.data)
                          .then(res => {
                            message.success("Cap nhap thành công")
                          })
                          .catch(err => {
                            message.error("Cap nhap that bai")
                          })
                      }}
              >
                Cap nhap
              </Button>
            </Row>
          </div>
        </div>
      )
    }
  }

}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(DOPage);

