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
import moment from 'moment';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import {Link} from 'react-router'
// import CompleteInput  from './component/Complete'
import {slugify} from '../_function'

const Option = Select.Option;
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
    agent.DieuHanh.PhuPhibyId(this.props.params.id)
      .then(res => {
        let PhuPhi = res
        that.setState(prev => { return {
          ...prev,
          edit: (moment(PhuPhi.time).diff(moment(Date.now() - 24*60*60*1000)) > 0),
          init: true,
          data: PhuPhi
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
              <h2 className="mt10 mt20 textCenter">Phu phi</h2>
              
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Khoan Chi : </span><b>{this.state.data.khoanchi}</b>
              </div>
              
              <div>
                <span style={{width: 150, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số tiền : </span><b>{this.state.data.sotien } VNĐ</b>
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
          {this.state.init && (<div className="laixe-doWr">
            <h2 style={{textAlign: 'center'}}>Thêm các loại phụ phí</h2>
            <Row>
              Lái xe : {this.state.data.laixe[0].name}
              <br/>
              Thời gian : {moment(this.state.data.time).format('DD/MM/YYYY')}
            </Row>
            <Row>
              Lý do:
              <CompleteInput
                disabled={!this.state.edit}
                defaultValue={this.state.data.khoanchi}
                option={[
                  "Tiền dầu",
                  "Tiền luật",
                  "Tiền nước",
                  "Tiền nhà nghỉ",
                ]}
                onChange={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        khoanchi: value
                      }
                    }
                  })
                }}
              />
            </Row>
            
            <Row style={{marginTop: 10}}>
              Số Tiền:
              <InputNumber
                disabled={!this.state.edit}
                defaultValue={this.state.data.sotien}
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
                        sotien: value
                      }
                    }
                  })
                }}
              />
            </Row>
            <Row style={{marginTop: 10}}>
              <Button
                style={{width: 200, height: 60, fontSize: 40}}
                type="primary"
                onClick={() => {
                  agent.DieuHanh.capnhapPhuPhi(gThis.state.data)
                    .then(res => {
                      // this.context.router.replace('/laixe/danhsachphuphi');
                      message.success("Cập nhập thành công")
                    })
                    .catch(err => {
                      message.success("Cập nhập that bai")
                    })
                }}
              >
                Cập nhập
              </Button>
              <div className="updateButton">
                <Link to="/dieuhanh/phuphi">
                  <Button type="primary"
                          style={{width: 200, height: 60, fontSize: 30}}
                  >Quay lại</Button>
                </Link>
              </div>
            </Row>
          </div>)}
          
          {!this.state.init && (
            <div style={{textAlign: 'center', paddingTop: 50}}>
              <Spin  size="large" tip="Đang tải..." />
            </div>
          )}
        </div>
      )
    }
  }
  
}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(DOPage);

