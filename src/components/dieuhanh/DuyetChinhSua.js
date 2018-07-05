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

// var jsondiffpatch = require('jsondiffpatch').create({
//   // used to match objects when diffing arrays, by default only === operator is used
//   objectHash: function(obj) {
//     // this function is used only to when objects are not equal by ref
//     return obj._id || obj.id;
//   },
//   arrays: {
//     // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
//     detectMove: true,
//     // default false, the value of items moved is not included in deltas
//     includeValueOnMove: false
//   },
//   textDiff: {
//     // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
//     minLength: 60
//   },
//   propertyFilter: function(name, context) {
//     /*
//      this optional function can be specified to ignore object properties (eg. volatile data)
//      name: property name, present in either context.left or context.right objects
//      context: the diff context (has context.left and context.right objects)
//      */
//     return name.slice(0, 1) !== '$';
//   },
//   cloneDiffValues: false /* default false. if true, values in the obtained delta will be cloned
//    (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects. this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
//    instead of true, a function can be specified here to provide a custom clone(value)
//    */
// });



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
      // console.log(danhsach)
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
              <div>
                Mục đã sửa:
                {/*<div style={{color: 'red'}}>Số đầu tỉnh</div>*/}
                {(el.cu.loai !== el.moi.loai) && <div style={{color: 'red'}}>Nội thành/Ngoại thành/Tỉnh</div>}
                {(el.cu.thauphu !== el.moi.thauphu) && <div style={{color: 'red'}}>Thầu phụ</div>}
                {(el.cu.khachhang !== el.moi.khachhang) && <div style={{color: 'red'}}>Khách hàng</div>}
                {(el.cu.laixe !== el.moi.laixe) && <div style={{color: 'red'}}>Lái xe</div>}
                {(el.cu.xe !== el.moi.xe) && <div style={{color: 'red'}}>Xe</div>}
              </div>

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
                      chinhsua={el.diff}
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
                      chinhsua={el.diff}
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
