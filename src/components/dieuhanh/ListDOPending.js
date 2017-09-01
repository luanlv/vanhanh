import React from 'react';
import agent from '../../agent';
import PropTypes from 'prop-types';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  LAIXE_DO_LOADED
} from '../../constants/actionTypes';
import SelectLaiXe  from '../_components/SelectLaiXe'

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
      laixe: [],
      init: false,
      listDO: true,
      chonlaixe: []
    }
  }

  componentWillMount() {
    this.init()
  }
  
  init() {
    let that = this;
    agent.DieuHanh.danhsachlaixe()
      .then(res => {
        that.setState(prev => {return {
          ...prev,
          laixe: res
        }})
  
        agent.DieuHanh.listDOchuaphancong()
          .then(res => {
            this.setState(prev => { return {
              ...prev,
              init: true,
              listDO: res
            }})
          })
        
      })
    
  }

  componentWillUnmount() {
    // this.props.onUnload();
  }
  
  changeLaiXe(value, index) {
    let chonlaixe = this.state.chonlaixe
    chonlaixe[index] = parseInt(value)
    this.setState(prev => {
      return {
        ...prev,
        chonlaixe: chonlaixe
      }
    })
    console.log(this.state)
  }
  
  chonlaixe(idDO, laixe){
    agent.DieuHanh.chonlaixe({id: idDO, laixe: laixe})
      .then(res => {
        message.success("Phân công xe thành công")
        this.context.router.replace('/dieuhanh/do');
      })
      .catch(err => {
        message.error("Loi")
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
                      <div key={index} className="listDO">
                        {/*<div>*/}
                        {/*<Row>*/}
                        {/*<Link to={"/laixe/do/" + el._id}>*/}
                        {/*<Button*/}
                        {/*type="primary"*/}
                        {/*>Chi tiết</Button>*/}
                        {/*</Link>*/}
                        {/*</Row>*/}
                        {/*</div>*/}
                          <div>
                            {/*<b style={{color: 'red', fontWeight: 'bold'}}>{"DO" + (el._id + 10000)}</b>*/}
                            <div style={{fontSize: '16px'}}>
                              {/*<b style={{color: '#FEC713'}}>{moment(el.time).format('DD/MM/YYYY')}</b> |*/}
                              Khách hàng: <b style={{}}> {el.khachhang}</b>
                              <br/>
                              Điểm nhận hàng: <b style={{}}> <div>+ {el.diemxuatphat.name}</div></b>
                              Điểm trả hàng: <b>{el.diemtrahang.length}</b> điểm
                              <b style={{}}>{el.diemtrahang.map((el) => {return <div>+ {el.name}</div>})}</b>
                            </div>
                            {/*<Brief><b style={{color: 'blue'}}>{el.laixe[0].name}</b></Brief>*/}
                            {el.tienthu > 0 && <div>Thu hộ: <b style={{color: '#FE6A14'}}>{el.tienthu.toLocaleString()} đ</b></div>}
                            {el.tienphatsinh > 0 && <div>Phí phát sinh: <b style={{color: '#FE6A14'}}>{el.tienphatsinh.toLocaleString()} đ</b></div>}
                          </div>
  
                        <Row>
                          <b style={{fontSize: '1.2rem'}}>Lái xe:</b>
                          <SelectLaiXe
                            option={this.state.laixe}
                            handleChange={(value) => this.changeLaiXe( value, index)}
                          />
                          <br/><br/>
                          <Button type="primary"
                            onClick={() => {
                              let that = this;
                              if(this.state.chonlaixe[index]){
                                this.chonlaixe(that.state.listDO[index]._id, that.state.chonlaixe[index])
                              }
                            }}
                          >Xác nhận</Button>
                        </Row>
                        
                      </div>
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


ListDO.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDO);
