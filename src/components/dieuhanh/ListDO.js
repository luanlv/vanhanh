import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  LAIXE_DO_LOADED
} from '../../constants/actionTypes';

import {Row, Icon, Spin, message, Button as ButtonWeb} from 'antd'
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
    dispatch({ type: LAIXE_DO_LOADED, payload }),
});

class ListDO extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      init: false,
      listDO: true
    }
  }

  componentWillMount() {
    this.init()
  }
  
  init() {
    agent.DieuHanh.listDOchuaxacnhan()
      .then(res => {
        this.setState(prev => { return {
          ...prev,
          init: true,
          listDO: res
        }})
      })
  }

  componentWillUnmount() {
    // this.props.onUnload();
  }

  duyet(id, action){
    let that = this
    agent.DieuHanh.duyet(id, action)
      .then(res => {
        message.success("Duyệt thành công")
        that.init()
      })
      .catch(err => {
        message.success("Có lỗi")
      })
  }

  render() {
    let that = this
    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <Row className="laixe-listDO-Wr" style={{paddingTop: '0.3rem', paddingBottom: '1rem'}}>
          <h2 className="textCenter" style={{fontSize: '0.8rem', paddingBottom: '0.3rem'}}>Danh sách chờ duyệt</h2>
          {this.state.init && (
              <div>
                  {this.state.listDO.map((el, index) => {
                    console.log(el)
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
                              {/*<Link  to={'/dieuhanh/do/' + el._id}><Button type="ghost">Xem</Button></Link>*/}
                            {/*</Row>*/}
                          </div>}
                          className="list-do"
                          multipleLine
                          platform="android"
                          key={index}
                        >
                          <b style={{color: 'red', fontWeight: 'bold'}}>{"DO" + (el._id + 10000)}</b>
      
                          {!el.trangthai.daduyet && <b style={{color: 'orange'}}> [Đang chờ duyệt]</b> }
                          {el.trangthai.daduyet && (
                            ((el.trangthai.duyet) ?
                                (<b style={{color: 'green'}}> [Xác nhận]</b>) :
                                (<b style={{color: 'red'}}> [Hủy]</b>)
                            )
                          ) }
      
                          <Brief>
                            <b style={{color: '#FEC713'}}>{moment(el.time).format('DD/MM/YYYY')}</b> |
                            <b style={{}}> {el.khachhang}</b>
                          </Brief>
                          {/*<Brief><b style={{color: 'blue'}}>{el.laixe[0].name}</b></Brief>*/}
                          {el.tienthu > 0 && <Brief>Thu hộ: <b style={{color: '#FE6A14'}}>{el.tienthu.toLocaleString()} đ</b></Brief>}
                          {el.tienphatsinh > 0 && <Brief>Phí phát sinh: <b style={{color: '#FE6A14'}}>{el.tienphatsinh.toLocaleString()} đ</b></Brief>}
                          <Brief><Link to={"/dieuhanh/do/" + el._id}><ButtonWeb>Xem chi tiết</ButtonWeb></Link></Brief>
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
