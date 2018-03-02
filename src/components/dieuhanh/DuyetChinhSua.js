import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area} from 'recharts'
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import {bindAll, intersection, debounce} from 'lodash'
import DO from './DO'
import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio, Tabs, Popconfirm, notification} from 'antd';
import moment from 'moment'

const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  user: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});



class DuyetChinhSua extends React.Component {
  
  constructor(props){
    
    super(props)
    
    this.state = {

      init: false,
      loadingText: '...',

      danhsachthauphu: [],
      thauphuOBJ: {},
      danhsachlaixe: [],
      laixeOBJ: {},
      danhsachxe: [],

      khachhang: [],
      khachhangObj: {},

      dieuxe: [],
      dieuxeObj: {},

      danhsach: []
    }
    bindAll(this, 'init', 'init2')
  }
  
  componentWillMount = async () => {
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
    this.init()
  }
  
  init = async () => {
    let that = this;
    try {
      const dieuxe = await agent.DieuHanh.dieuXe()
      let dx = {}
      dieuxe.forEach(el => {
        dx[el.ma] = el
      })

      const danhsachthauphu = await agent.DieuHanh.danhSachThauPhu();
      const danhsachlaixe = await agent.DieuHanh.danhsachlaixe()
      const danhsachxe = await agent.DieuHanh.danhsachxe()
      let danhsach = await agent.DieuHanh.danhsachchinhsua()
      // console.log(date)
      let tp = {}
      danhsachthauphu.forEach(el => {
        tp[el.ma] = el
      })
      let lx = {}
      danhsachlaixe.forEach(el => {
        lx[el.ma] = el
      })
      lx[999] = {ten : 'thầu phụ'}
      this.setState({
        // date: date.date,
        danhsachthauphu: danhsachthauphu,
        danhsachlaixe: danhsachlaixe,
        danhsachxe: danhsachxe,
        thauphuOBJ: tp,
        laixeOBJ: lx,
        danhsach: danhsach,
        dieuxe: dieuxe,
        dieuxeObj: dx,
        init: true,
      })

    }catch (e) {
      that.setState({
        loadingText: '' + e
      })
    }
  }

  init2 = async () => {
    let that = this
    let danhsach = await agent.DieuHanh.danhsachchinhsua()
    this.setState({
      danhsach: danhsach,
    })
  }

  
  render() {


    if(!this.state.init){
      return (
        <div>
          {this.state.loadingText}
        </div>
      )
    }

    return (
      <div className="home-page">
        {this.state.danhsach.map((el, idx) => {
          return (
            <Row
              key={idx}
              style={{padding: 10, border: '2px solid #333', cursor: 'pointer', marginBottom: 20, fontSize: 10, radius: 10}}>
              <div
                style={{textAlign: 'right', marginLeft: 40, marginRight: 40}}
              >
                <span style={{marginRight: 20}}>Người yêu cầu: {this.state.dieuxeObj[el.nguoiyeucau].ten}</span>
                <span style={{marginRight: 20}}>Mã lênh: {el._id}</span>
                <Button type="danger"
                        onClick={() => {
                          let that = this;
                          agent.DieuHanh.keToanHuyDuyetChinhSua({id: el.do})
                            .then(res => {
                              message.success('Duyệt thành công')
                              that.init2()
                            })
                        }}
                >Hủy</Button>
                -
                <Button type="primary"
                  onClick={() => {
                    let that = this;
                    agent.DieuHanh.keToanDuyetChinhSua({id: el.do})
                      .then(res => {
                        message.success('Duyệt thành công')
                        that.init()
                      })
                  }}
                >Duyệt</Button>
              </div>
              <div
              >
                <Col span={12}>
                  <DO danhsachxe={this.state.danhsachxe}
                      danhsachlaixe={this.state.danhsachlaixe}
                      danhsachthauphu={this.state.danhsachthauphu}
                      success={() => {
                        // this.hideModal()
                        // this.init(this.state.date, this.state.date2)
                      }}
                      data={el.cu}
                      tinhtrang={el.cu.tinhtrang}
                      edit={true}
                      date={el.cu.date}
                      duyetchinhsua={true}
                  />
                </Col>
                <Col span={12}>
                  <DO danhsachxe={this.state.danhsachxe}
                      danhsachlaixe={this.state.danhsachlaixe}
                      danhsachthauphu={this.state.danhsachthauphu}
                      success={() => {
                        // this.hideModal()
                        // this.init(this.state.date, this.state.date2)
                      }}
                      data={el.moi}
                      tinhtrang={el.moi.tinhtrang}
                      edit={true}
                      date={el.moi.date}
                      duyetchinhsua={true}
                  />
                </Col>
              </div>
            </Row>
          )
        })}

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DuyetChinhSua);
