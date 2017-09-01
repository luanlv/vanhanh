import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  LAIXE_PHUPHI_LOADED
} from '../../constants/actionTypes';

import { Row, Icon, Spin, message} from 'antd'
import { List, Modal, Button } from 'antd-mobile';
import ReactList from 'react-list';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import moment from 'moment'

const Promise = global.Promise;
const Item = List.Item;
const Brief = Item.Brief;
const operation = Modal.operation;

const mapStateToProps = state => ({
  ...state.laixe,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),

  onLoad: ( payload) =>
    dispatch({ type: LAIXE_PHUPHI_LOADED, payload }),
});

class ListDO extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      init: false,
      listPhuPhi: []
    }
  }
  
  componentWillMount() {
    this.init()
  }
  
  init() {
    agent.DieuHanh.listPhuPhi()
      .then(res => {
        this.setState(prev => { return {
          ...prev,
          init: true,
          listPhuPhi: res
        }})
      })
  }

  componentWillUnmount() {
    // this.props.onUnload();
  }
  
  duyet(id, action){
    let that = this
    agent.DieuHanh.duyetphuphi(id, action)
      .then(res => {
        message.success("Duyệt thành công")
        that.init()
      })
      .catch(err => {
        message.success("Có lỗi")
      })
  }

  render() {

    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <Row className="laixe-listDO-Wr" style={{paddingTop: '0.3rem'}}>
          <h2 className=" textCenter" style={{fontSize: '0.8rem', paddingBottom: '0.3rem'}}>Phụ phí chưa duyệt</h2>
        
          {this.state.init && (
              <div>
                  {this.state.listPhuPhi.map((el, index) => {
                    return (
                      <Item
                        extra={<div>
                          <Row>
                            <Button
                              type="primary"
                              onClick={() => operation([
                                { text: 'Xác nhận ', onPress: () => {
                                  let that = this;
                                  this.duyet(el._id, true)
                                } },
                                { text: 'Quay lại', onPress: () => {} },
                              ])}
                            >Đồng ý</Button>
                          </Row>
                          <Row style={{marginTop: 10}}>
                            <Button
                              type="warning"
                              onClick={() => operation([
                                { text: 'Xác nhận ', onPress: () => {
                                  let that = this;
                                  this.duyet(el._id, false)
              
                                } },
                                { text: 'Quay lại', onPress: () => {} },
                              ])}
                            >Hủy</Button>
                          </Row>
                          {/*<Row style={{marginTop: 10}}>*/}
                            {/*<Link  to={'/dieuhanh/phuphi/' + el._id}><Button type="ghost">Xem</Button></Link>*/}
                          {/*</Row>*/}
                        </div>}
                        className="list-do"
                        multipleLine
                        platform="android"
                        key={index}
                      >
                        <b style={{color: 'red', fontWeight: 'bold'}}>{el.sotien.toLocaleString()} đ</b> | {el.khoanchi}
    
                        <Brief>
                          <b style={{color: '#FEC713'}}>{moment(el.time).format('DD/MM/YYYY')}</b>
                        </Brief>
                        <Brief>{el.lydo} </Brief>
                        <Brief><b style={{color: 'blue'}}>{el.laixe[0].name}</b></Brief>
                      </Item>
                    )
                    })
                  }
              </div>
          )}
          {!this.state.init && (
            <div style={{textAlign: 'center', paddingTop: 50}}>
              <Spin tip="Loading..." />
            </div>
          )}
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDO);
