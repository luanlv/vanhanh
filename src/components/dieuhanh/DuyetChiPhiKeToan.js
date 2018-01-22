import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import {bindAll, intersection, debounce} from 'lodash'

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio, Tabs, Popconfirm, notification, InputNumber} from 'antd';
import moment from 'moment'

const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

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

class Home extends React.Component {

  constructor(props){

    super(props)

    this.state = {
      startValue: moment(Date.now()).format('YYYYMMDD'),
      endValue: moment(Date.now()).format('YYYYMMDD'),
      laixe: 'tatca',
      endOpen: false,
      init: false,
      loadingText: '...',

      danhsachthauphu: [],
      danhsachthauphuObj: {},

      danhsachlaixe: [],
      danhsachlaixeObj: {},

      danhsachxe: [],
      danhsachxeObj: {},

      do: [],

      chiphi: {},
      ghichuketoan: ''
    }
    bindAll(this, 'init', 'info', 'chinhsua', 'changeLaiXe', 'onChangeRange', 'handleChange' )
    this.init()
  }

  componentWillMount = async () => {
    const danhsachthauphu = await agent.DieuHanh.danhSachThauPhu()
    let danhsachthauphuObj = {}

    danhsachthauphu.map(el => {
      danhsachthauphuObj[el.ma] = el
    })

    const khachhang = await agent.DieuHanh.khachHang()
    let khachhangObj = {}
    khachhang.map(el => {
      khachhangObj[el.code] = el
    })


    const danhsachlaixe = await agent.DieuHanh.danhsachlaixe()
    let danhsachlaixeObj = {}
    danhsachlaixe.map(el => {
      danhsachlaixeObj[el.ma] = el
    })
    danhsachlaixeObj[999] = {
      ma: 999,
      ten: 'Lái xe thầu phụ'
    }
    this.setState(prev => {
      return {
        ...prev,
        danhsachthauphu: danhsachthauphu,
        danhsachthauphuObj: danhsachthauphuObj,
        danhsachlaixe: danhsachlaixe,
        danhsachlaixeObj: danhsachlaixeObj,
        danhsachkhachhang: khachhang,
        khachhangObj: khachhangObj,
        filteredInfo: null,
        init: true,
      }
    })

  }

  init = async () => {
    const danhsachxe = await agent.DieuHanh.danhsachxe()
    let danhsachxeObj = {}

    danhsachxe.map(el => {
      danhsachxeObj[el.bks] = el
    })
    const DO = await agent.LaiXe.daKhaiBao(this.state.startValue, this.state.endValue, this.state.laixe)
    this.setState({
      do: DO,
      danhsachxe: danhsachxe,
      danhsachxeObj: danhsachxeObj,
    })
  }

  xemLenh = async (ma) => {
    const DO = await agent.DieuHanh.doById(ma)
    if (DO && DO.length > 0) {
      xemlenh(DO[0], this.state.danhsachthauphuObj)
    } else {
      alert('Không tìm thấy DO')
    }
  }

  handleChange = (pagination, filters, sorter) => {
    // console.log('Various parameters', filters);
    this.setState({
      filteredInfo: filters,
    })
  }

  render() {
    const role = this.props.user.role;
    let that = this
    if(!this.state.init){
      return (
        <div>
          {this.state.loadingText}
        </div>
      )
    }

    const { startValue, endValue, endOpen } = this.state;
    let chuaduyet = []
    let daduyet = []
    let ketoanduyet = []
    let tongchiphi = 0
    this.state.do.map((el, idx) => {
      if(!el.dinhmuc){
        el.dinhmuc = 14.5
      }
      if(!el.giadau){
        el.giadau = 13000
      }
      if(el.ketoan){
        ketoanduyet.push(el)
        let chiphi = el;
        if(chiphi.sodautinh > 0) tongchiphi = tongchiphi + (Math.floor(chiphi.km*chiphi.dinhmuc*chiphi.giadau/100) + tiendautinh(chiphi.mapDO[0].trongtai, chiphi.sodautinh) + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiem) + chiphi.cauduong + chiphi.bocxep + chiphi.luudem + chiphi.luat + chiphi.phikhac)
        if(chiphi.sodautinh === 0) tongchiphi = tongchiphi + (Math.floor(chiphi.km*chiphi.dinhmuc*chiphi.giadau/100) + tienmoichuyen(chiphi.mapDO[0].trongtai, chiphi.sochuyen)  + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiem) + chiphi.cauduong + chiphi.bocxep + chiphi.luudem + chiphi.luat + chiphi.phikhac)
      } else {
        if (el.dieuhanh) {
          daduyet.push(el)
        } else {
          chuaduyet.push(el)
        }
      }
    })
    return (
      <div>
        <h5 style={{textAlign: 'center'}}>Duyệt chi phí</h5>
        <RangePicker
          defaultValue={[moment(startValue, 'YYYYMMDD'), moment(endValue, 'YYYYMMDD')]}
          format={'DD/MM/YYYY'}
          onChange={this.onChangeRange}
        />
        <Select
          style={{width: 250}}
          value={this.state.laixe}
          onChange={this.changeLaiXe}
        >
          <Option key="tatca" value="tatca">Tất cả { this.state.laixe === 'tatca' && <span style={{color: 'red', fontWeight: 'bold'}}>({this.state.do.length})</span> }</Option>
          { this.state.danhsachlaixe.map((el, idx) => {
            let length = this.state.do.filter((e) => {return e.laixe == el.ma}).length
            return (<Option key={idx} value={'' + el.ma}>{el.ten} { length > 0 && <span style={{color: 'red', fontWeight: 'bold'}}>({length})</span> }</Option>)
          })
          }
        </Select>


        <hr/>

        <Tabs
          defaultActiveKey="2"
          tabPosition={"top"}
        >
          <TabPane tab={(<span>Chờ duyệt (<b style={{color: daduyet.length > 0 ? 'red': ''}}>{daduyet.length}</b>)</span>)} key="2">
            <div className="chiphi">

              <Table dataSource={daduyet}
                     size="small"
                     scroll={{ x: 1800}}
                     indentSize={15}
                     bordered
                     pagination={{pageSize: 100}}
                     onRowDoubleClick={(record, index, event) => {
                       // this.info(record, this.state)
                       let that = this;
                       that.setState({
                         chiphi: record
                       }, () => {
                         // console.log(that.state.chiphi)
                         that.chinhsua()
                       })
                     }}
                     onChange={this.handleChange}
              >
                <Column
                  width={20}
                  title="Mã lệnh"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0]._id}
                  </span>
                  )}
                />
                <Column
                  width={30}
                  title="Biển kiểm soát"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].xe}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Tải trọng"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].trongtai}
                  </span>
                  )}
                />


                <Column
                  width={40}
                  title="Tên lái xe"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {this.state.danhsachlaixeObj[record.mapDO[0].laixe].ten}
                  </span>
                  )}
                />

                <Column
                  width={40}
                  title="Khách hàng"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {this.state.khachhangObj[record.mapDO[0].khachhang].value}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Tỉnh đi"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].tinhxuatphat.name}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Tỉnh đến"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].tinhtrahang.name}
                  </span>
                  )}
                />

                <ColumnGroup title="Chi phí dầu">

                  <Column
                    width={20}
                    title="KM"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.km}
                  </span>
                    )}
                  />

                  <Column
                    width={30}
                    title="Định mức"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.dinhmuc}
                  </span>
                    )}
                  />

                  <Column
                    width={20}
                    title="Giá dầu"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.giadau}
                  </span>
                    )}
                  />


                  <Column
                    width={30}
                    title="Tổng"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {Math.floor(record.km/record.dinhmuc*record.giadau)}
                  </span>
                    )}
                  />

                </ColumnGroup>


                <ColumnGroup title="Chuyến">


                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                      {record.sodautinh === 0 && <span>
                        {tienmoichuyen(record.mapDO[0].trongtai, record.sochuyen).toLocaleString()}
                      </span>}
                      </span>
                    )}

                  />

                </ColumnGroup>

                <ColumnGroup title="Đầu tỉnh">

                  <Column
                    width={30}
                    title="Số tỉnh"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.sodautinh}
                  </span>
                    )}
                  />


                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {tiendautinh(record.mapDO[0].trongtai, record.sodautinh)}
                  </span>
                    )}
                  />

                </ColumnGroup>

                <ColumnGroup title="Điểm">

                  <Column
                    width={20}
                    title="Số điểm"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.sodiem}
                  </span>
                    )}
                  />
                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                      {tiendiem(record.mapDO[0].trongtai, record.sodiem)}
                  </span>
                    )}
                  />

                </ColumnGroup>

                <Column
                  width={30}
                  title="Cầu đường"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.cauduong}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Bốc xếp"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.bocxep}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Lưu đêm"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.luudem}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Luật"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.luat}
                  </span>
                  )}
                />
                <Column
                  width={20}
                  title="Phí khác"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.phikhac}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Ghi chú"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.ghichu}
                  </span>
                  )}
                />

              </Table>
            </div>
          </TabPane>
          <TabPane tab={(<span>Điều hành chưa duyệt (<b style={{color: chuaduyet.length > 0 ? 'red': ''}}>{chuaduyet.length}</b>)</span>)} key="1">

            <div className="chiphi">

              <Table dataSource={chuaduyet}
                     size="small"
                     scroll={{ x: 1800}}
                     indentSize={15}
                     bordered
                     pagination={{pageSize: 100}}
                     onRowDoubleClick={(record, index, event) => {
                       // this.info(record, this.state)
                       let that = this;
                       that.setState({
                         chiphi: record
                       }, () => {
                         // console.log(that.state.chiphi)
                         that.chinhsua()
                       })
                     }}
                     onChange={this.handleChange}
              >
                <Column
                  width={20}
                  title="Mã lệnh"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0]._id}
                  </span>
                  )}
                />
                <Column
                  width={30}
                  title="Biển kiểm soát"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].xe}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Tải trọng"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].trongtai}
                  </span>
                  )}
                />


                <Column
                  width={40}
                  title="Tên lái xe"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {this.state.danhsachlaixeObj[record.mapDO[0].laixe].ten}
                  </span>
                  )}
                />

                <Column
                  width={40}
                  title="Khách hàng"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {this.state.khachhangObj[record.mapDO[0].khachhang].value}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Tỉnh đi"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].tinhxuatphat.name}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Tỉnh đến"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].tinhtrahang.name}
                  </span>
                  )}
                />

                <ColumnGroup title="Chi phí dầu">

                  <Column
                    width={20}
                    title="KM"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.km}
                  </span>
                    )}
                  />

                  <Column
                    width={30}
                    title="Định mức"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.dinhmuc}
                  </span>
                    )}
                  />

                  <Column
                    width={20}
                    title="Giá dầu"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.giadau.toLocaleString()}
                  </span>
                    )}
                  />


                  <Column
                    width={30}
                    title="Tổng"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {Math.floor(record.km/record.dinhmuc*record.giadau).toLocaleString()}
                  </span>
                    )}
                  />

                </ColumnGroup>


                <ColumnGroup title="Chuyến">


                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                      {record.sodautinh === 0 && <span>
                        {tienmoichuyen(record.mapDO[0].trongtai, record.sochuyen).toLocaleString()}
                      </span>}
                      </span>
                    )}

                  />

                </ColumnGroup>

                <ColumnGroup title="Đầu tỉnh">

                  <Column
                    width={30}
                    title="Số tỉnh"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.sodautinh}
                  </span>
                    )}
                  />


                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {tiendautinh(record.mapDO[0].trongtai, record.sodautinh).toLocaleString()}
                  </span>
                    )}
                  />

                </ColumnGroup>

                <ColumnGroup title="Điểm">

                  <Column
                    width={20}
                    title="Số điểm"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.sodiem}
                  </span>
                    )}
                  />
                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                      {tiendiem(record.mapDO[0].trongtai, record.sodiem).toLocaleString()}
                  </span>
                    )}
                  />

                </ColumnGroup>

                <Column
                  width={30}
                  title="Cầu đường"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.cauduong.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Bốc xếp"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.bocxep.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Lưu đêm"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.luudem.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Luật"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.luat.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Phí khác"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.phikhac.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Ghi chú"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.ghichu}
                  </span>
                  )}
                />

              </Table>
            </div>

          </TabPane>

          <TabPane tab={(<span>Đã duyệt (<b style={{color: ketoanduyet.length > 0 ? 'red': ''}}>{ketoanduyet.length}</b>) Tổng chi phí: <b style={{color: 'red'}}>{tongchiphi.toLocaleString()}</b> đ</span>)} key="3">

            <div className="chiphi">

              <Table dataSource={ketoanduyet}
                     size="small"
                     scroll={{ x: 1800}}
                     indentSize={15}
                     bordered
                     pagination={{pageSize: 100}}
                     onRowDoubleClick={(record, index, event) => {
                       // this.info(record, this.state)
                       let that = this;
                       that.setState({
                         chiphi: record
                       }, () => {
                         // console.log(that.state.chiphi)
                         that.chinhsua()
                       })
                     }}
                     onChange={this.handleChange}
              >
                <Column
                  width={20}
                  title="Mã lệnh"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0]._id}
                  </span>
                  )}
                />
                <Column
                  width={30}
                  title="Biển kiểm soát"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].xe}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Tải trọng"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].trongtai}
                  </span>
                  )}
                />


                <Column
                  width={40}
                  title="Tên lái xe"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {this.state.danhsachlaixeObj[record.mapDO[0].laixe].ten}
                  </span>
                  )}
                />

                <Column
                  width={40}
                  title="Khách hàng"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {this.state.khachhangObj[record.mapDO[0].khachhang].value}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Tỉnh đi"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].tinhxuatphat.name}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Tỉnh đến"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.mapDO[0].tinhtrahang.name}
                  </span>
                  )}
                />

                <ColumnGroup title="Chi phí dầu">

                  <Column
                    width={20}
                    title="KM"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.km}
                  </span>
                    )}
                  />

                  <Column
                    width={30}
                    title="Định mức"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.dinhmuc}
                  </span>
                    )}
                  />

                  <Column
                    width={20}
                    title="Giá dầu"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.giadau.toLocaleString()}
                  </span>
                    )}
                  />


                  <Column
                    width={30}
                    title="Tổng"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {Math.floor(record.km/record.dinhmuc*record.giadau).toLocaleString()}
                  </span>
                    )}
                  />

                </ColumnGroup>


                <ColumnGroup title="Chuyến">


                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                      {record.sodautinh === 0 && <span>
                        {tienmoichuyen(record.mapDO[0].trongtai, record.sochuyen).toLocaleString()}
                      </span>}
                      </span>
                    )}

                  />

                </ColumnGroup>

                <ColumnGroup title="Đầu tỉnh">

                  <Column
                    width={30}
                    title="Số tỉnh"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.sodautinh}
                  </span>
                    )}
                  />


                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {tiendautinh(record.mapDO[0].trongtai, record.sodautinh).toLocaleString()}
                  </span>
                    )}
                  />

                </ColumnGroup>

                <ColumnGroup title="Điểm">

                  <Column
                    width={20}
                    title="Số điểm"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                        {record.sodiem}
                  </span>
                    )}
                  />
                  <Column
                    width={30}
                    title="Tiền"
                    // dataIndex="ghichu"
                    // key="ghichu"
                    render={(text, record) => (
                      <span>
                      {tiendiem(record.mapDO[0].trongtai, record.sodiem).toLocaleString()}
                  </span>
                    )}
                  />

                </ColumnGroup>

                <Column
                  width={30}
                  title="Cầu đường"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.cauduong.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Bốc xếp"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.bocxep.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Lưu đêm"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.luudem.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Luật"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.luat.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={20}
                  title="Phí khác"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.phikhac.toLocaleString()}
                  </span>
                  )}
                />

                <Column
                  width={30}
                  title="Ghi chú"
                  // dataIndex="ghichu"
                  // key="ghichu"
                  render={(text, record) => (
                    <span>
                      {record.ghichu}
                  </span>
                  )}
                />

              </Table>
            </div>

          </TabPane>

        </Tabs>
        <hr/>
      </div>
    )
  }


  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() < startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  changeLaiXe = async (value) => {
    // console.log(value)
    await this.setState({laixe: value})
    this.init()
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
    this.init()
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
    this.init()
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  onChangeRange = (dates, datesString) => {
    let that = this;
    if(dates[0] && dates[1]) {
      that.setState({
        startValue: dates[0].format('YYYYMMDD'),
        endValue: dates[1].format('YYYYMMDD'),

      }, () => {
        that.init()
        // console.log(that.state.startValue)
        // console.log(that.state.endValue)
      })
    }
  }

  info = (chiphi, state) => {
    let that = this;
    let modal = Modal.info({
      width: 800,
      title: `Chi phí chuyến ${chiphi.mapDO[0]._id}`,
      content: (
        <div>
          <div>
            <div>
              Lái xe: <b style={{color: 'red'}}>{state.danhsachlaixeObj[chiphi.laixe].ten}</b>
            </div>
            <div>
              Biển kiểm soát: <b style={{color: 'red'}}>{chiphi.mapDO[0].xe}</b>
            </div>
            <div>
              Km chạy: <b style={{color: 'red'}}>{chiphi.km} KM</b> (km đầu: <b style={{color: 'red'}}>{chiphi.kmdau}</b> - km cuối: <b style={{color: 'red'}}>{chiphi.kmcuoi}</b>)
              <br/>
              Tổng chi phí dầu: <b style={{color: 'red'}}>{Math.floor(chiphi.km*chiphi.dinhmuc*chiphi.giadau/100).toLocaleString().toLocaleString()}</b>
            </div>

            {chiphi.sodautinh === 0 && <div>
              Tiền chuyến: <b style={{color:'red'}}>{tienmoichuyen(chiphi.mapDO[0].trongtai, chiphi.sodautinh).toLocaleString()}</b>
            </div>}

            {chiphi.sodautinh > 0 && <div>
              Tiền tỉnh: <b style={{color:'red'}}>{tiendautinh(chiphi.mapDO[0].trongtai, chiphi.sodautinh).toLocaleString()}</b>
            </div>}

            <div>
              Tiền điểm: <b style={{color:'red'}}>{tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodautinh).toLocaleString()}</b>
            </div>
            <div>
              Tiền cầu đường: <b style={{color:'red'}}>{chiphi.cauduong.toLocaleString()}</b>
            </div>
            <div>
              Tiền bốc xếp: <b style={{color:'red'}}>{chiphi.bocxep.toLocaleString()}</b>
            </div>
            <div>
              Tiền lưu đêm: <b style={{color:'red'}}>{chiphi.luudem.toLocaleString()}</b>
            </div>
            <div>
              Tiền luật: <b style={{color:'red'}}>{chiphi.luat.toLocaleString()}</b>
            </div>
            <div>
              Phí khác: <b style={{color:'red'}}>{chiphi.phikhac.toLocaleString()}</b>
            </div>
            {chiphi.phikhac > 0 && <div>
              Lý do chi phí khác: <b style={{color: 'red'}}>{chiphi.lydo}</b>
            </div>}
            Ghi chú: <b style={{color: 'red'}}>{chiphi.ghichu}</b>

            {chiphi.sodautinh > 0 && <div>Tổng chi phí: <b style={{color: 'red'}}>{(Math.floor(chiphi.km*chiphi.dinhmuc*chiphi.giadau/100) + tiendautinh(chiphi.mapDO[0].trongtai, chiphi.sodautinh) + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiem) + chiphi.cauduong + chiphi.bocxep + chiphi.luudem + chiphi.luat + chiphi.phikhac).toLocaleString()}</b> đ</div>}
            {chiphi.sodautinh === 0 && <div>Tổng chi phí: <b style={{color: 'red'}}>{(Math.floor(chiphi.km*chiphi.dinhmuc*chiphi.giadau/100) + tienmoichuyen(chiphi.mapDO[0].trongtai, chiphi.sochuyen)  + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiem) + chiphi.cauduong + chiphi.bocxep + chiphi.luudem + chiphi.luat + chiphi.phikhac).toLocaleString()}</b> đ</div>}

            <br/>
            <div>

              <Button type="primary"
                      onClick={() => {

                        that.xemLenh(chiphi.do)
                      }}
              >Chi tiết chuyến</Button>


              {chiphi.dieuhanh && !chiphi.ketoan && <Button type="primary"
                 style={{float: 'right', marginRight: 20}}
                 onClick={() => {
                   let that = this;
                   if(this.state.ghichuketoan) chiphi.ghichuketoan = this.state.ghichuketoan

                   agent.DieuHanh.keToanDuyetChiPhi(chiphi)
                     .then(res => {
                       message.success('Duyệt thành công')
                       modal.destroy()
                       that.init()
                     })
                 }}
              >Duyệt chi phí</Button>}

              { chiphi.dieuhanh && !chiphi.ketoan && <Button type="danger"
                                                             style={{float: 'right', marginRight: 20}}
                                                             onClick={() => {
                                                               let that = this;
                                                               if(this.state.ghichuketoan) chiphi.ghichuketoan = this.state.ghichuketoan
                                                               agent.DieuHanh.keToanHuyDuyetChiPhi(chiphi)
                                                                 .then(res => {
                                                                   message.success('Duyệt thành công')
                                                                   modal.destroy()
                                                                   that.init()
                                                                 })
                                                             }}
              >Hủy</Button> }

              <div>
                <br/>
                Ghi chú kế toán:
                <textarea
                  placeholder="Ghi chú"
                  row="2"
                  rows="4"
                  style={{width: '100%', padding: 5}}
                  defaultValue={chiphi.ghichuketoan || this.state.ghichuketoan}
                  onChange={(e) => {
                    let value = e.target.value
                    this.setState({
                      ghichuketoan: value
                    })
                  }}
                />
              </div>

              {chiphi.ghichudieuhanh && <div>
                <br/>
                Ghi chú điều hành:
                <textarea
                  disabled
                  placeholder="Ghi chú"
                  row="2"
                  rows="4"
                  style={{width: '100%', padding: 5}}
                  defaultValue={chiphi.ghichudieuhanh}
                />
              </div>}

            </div>
            <br/>
            <br/>
          </div>
        </div>
      ),
      onOk() {},
      okText: "Đóng",
      afterClose() {
        alert('Close !!!')
      }
    });
  }

  chinhsua = () => {
    let that = this;
    let chiphi = this.state.chiphi
    let chiphilaixe = chiphi.sodautinh > 0 ? (Math.floor(chiphi.km*chiphi.dinhmuc*chiphi.giadau/100) + tiendautinh(chiphi.mapDO[0].trongtai, chiphi.sodautinh) + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiem) + chiphi.cauduong + chiphi.bocxep + chiphi.luudem + chiphi.luat + chiphi.phikhac)
      : (Math.floor(chiphi.km*chiphi.dinhmuc*chiphi.giadau/100) + tienmoichuyen(chiphi.mapDO[0].trongtai, chiphi.sochuyen)  + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiem) + chiphi.cauduong + chiphi.bocxep + chiphi.luudem + chiphi.luat + chiphi.phikhac)

    let chiphidieuhanh = chiphi.sodautinh > 0 ? (Math.floor(chiphi.kmdh*chiphi.dinhmuc*chiphi.giadaudh/100) + tiendautinh(chiphi.mapDO[0].trongtai, chiphi.sodautinhdh) + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiemdh) + chiphi.cauduongdh + chiphi.bocxepdh + chiphi.luudemdh + chiphi.luatdh + chiphi.phikhacdh)
      : (Math.floor(chiphi.kmdh*chiphi.dinhmuc*chiphi.giadaudh/100) + tienmoichuyen(chiphi.mapDO[0].trongtai, chiphi.sochuyendh)  + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiemdh) + chiphi.cauduongdh + chiphi.bocxepdh + chiphi.luudemdh + chiphi.luatdh + chiphi.phikhacdh)
    // console.log(chiphidieuhanh)
    let modal = Modal.info({
      width: 1200,
      title: `Chi phí chuyến ${this.state.chiphi.mapDO[0]._id}`,
      content: (
        <div>
          <div>
            <div>
              {/*<Popconfirm title={"Duyệt chi phí chuyến: " + chiphidieuhanh + " đ"} okText="Xác nhận" cancelText="Hủy">*/}
              {!this.state.chiphi.ketoan && <Button type="primary"
                                                      style={{float: 'right'}}
                                                      onClick={() => {
                                                        let that = this;
                                                        let chiphi = this.state.chiphi
                                                        // chiphi.ghichudieuhanh = this.state.ghichudieuhanh
                                                        chiphi.kmkt = true
                                                        chiphi.giadaukt = true
                                                        chiphi.cauduongkt = true
                                                        chiphi.sochuyenkt = true
                                                        chiphi.sodautinhkt = true
                                                        chiphi.bocxepkt = true
                                                        chiphi.luudemkt = true
                                                        chiphi.luatkt = true
                                                        chiphi.phikhackt = true
                                                        chiphi.ketoan = true;
                                                        chiphi.ghichuketoan = this.state.ghichuketoan
                                                        this.setState({chiphi: chiphi}, () => {
                                                          agent.DieuHanh.keToanDuyetChiPhi(this.state.chiphi)
                                                            .then(res => {
                                                              message.success('Duyệt thành công')
                                                              // this.init()
                                                              modal.destroy()
                                                              that.init()
                                                              // that.chinhsua()
                                                            })
                                                        })
                                                        // this.state.chiphi.dinhmuc = this.state.danhsachxeObj[this.state.chiphi.mapDO[0].bks].dm;

                                                      }}
              >Duyệt chi phi</Button>}
              {this.state.chiphi.ketoan &&
              <span style={{float: "right", color: "green"}}>
                  Đã duyệt
                </span>
              }
              {/*</Popconfirm>*/}
            </div>
            Lái xe: <b style={{color: 'red'}}>{this.state.danhsachlaixeObj[this.state.chiphi.laixe].ten}</b>
            <br/>
            Biển kiểm soát: <b style={{color: 'red'}}>{this.state.chiphi.mapDO[0].xe}</b>
            <br/>
            <table style={{width: "100%",  border: '1px solid #ddd', borderCollapse: 'collapse'}}>
              <tr>
                <th style={{width: '15%', border: '1px solid #ddd'}}></th>
                <th style={{width: '30%', border: '1px solid #ddd'}}>Lái xe</th>
                <th style={{width: '30%', border: '1px solid #ddd'}}>Điều hành</th>
                <th style={{width: '20%', border: '1px solid #ddd'}}>Kế toán</th>
              </tr>
              <tr>
                <td style={{border: '1px solid #ddd'}}>Km chạy</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.km.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.kmdh.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Giá dầu</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.giadau.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.giadaudh.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Số đầu tỉnh</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.sodautinh}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.sodautinhdh}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Số điểm</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.sodiem}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.sodiemdh}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Tiền cầu đường</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.cauduong.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.cauduongdh.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Tiền bốc xếp</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.bocxep.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.bocxepdh.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Tiền lưu đêm</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.luudem.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.luudemdh.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Tiền luật</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.luat.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.luatdh.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{ border: '1px solid #ddd'}}>Chi phí khác</td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.phikhac.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}>{this.state.chiphi.phikhacdh.toLocaleString()}</b></td>
                <td style={{textAlign: 'center', border: '1px solid #ddd'}}><b style={{color: 'red'}}></b></td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Ghi chú:</td>
                <td style={{border: '1px solid #ddd', padding: 5}}><pre>{this.state.chiphi.ghichu}</pre></td>
                <td style={{border: '1px solid #ddd', padding: 5}}><pre>{this.state.chiphi.ghichudieuhanh}</pre></td>

                <td style={{border: '1px solid #ddd'}}>
                  <textarea
                    placeholder=""
                    row="2"
                    rows="4"
                    style={{width: '100%', padding: 5}}
                    defaultValue={chiphi.ghichuketoan || this.state.ghichuketoan}
                    onChange={(e) => {
                      let value = e.target.value
                      this.setState({
                        ghichuketoan: value
                      })
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td style={{border: '1px solid #ddd'}}>Tổng chi phí</td>
                <td style={{border: '1px solid #ddd'}}>
                  <div style={{textAlign: 'center'}}><b style={{color: 'red'}}>{chiphilaixe.toLocaleString()}</b> đ</div>
                </td>
                <td style={{border: '1px solid #ddd'}}>
                  <div style={{textAlign: 'center'}}><b style={{color: 'red'}}>{chiphidieuhanh.toLocaleString()}</b> đ</div>
                </td>
                <td style={{border: '1px solid #ddd'}}>
                </td>
              </tr>

            </table>

            <br/>
            <br/>
            <br/>
            <div>
              <Button type="default"
                      onClick={() => this.xemLenh(this.state.chiphi.do)}
              >Chi tiết chuyến chạy</Button>

              <Button type="primary"
                      style={{float: 'right'}}
                      onClick={() => {
                        let that = this;
                        // this.state.chiphi.dinhmuc = this.state.danhsachxeObj[this.state.chiphi.mapDO[0].bks].dm;
                        let chiphi = this.state.chiphi
                        chiphi.dieuhanh = false
                        chiphi.ghichuketoan = this.state.ghichuketoan
                        this.setState({chiphi: chiphi}, () => {
                          agent.DieuHanh.keToanDuyetChiPhi(this.state.chiphi)
                            .then(res => {
                              message.success('Cập nhập thành công')
                              // this.init()
                              modal.destroy()
                              that.init()
                              // that.chinhsua()
                            })
                        })

                      }}
              >Không duyệt</Button>

            </div>
            <br/>
            <br/>
          </div>
        </div>
      ),
      onOk() {},
      okText: "Đóng",
      afterClose() {
        alert('Close !!!')
      }
    });
  }

  chinhsua2 = () => {
    let that = this;
    let modal = Modal.info({
      width: 800,
      title: `Chi phí chuyến ${this.state.chiphi.mapDO[0]._id}`,
      content: (
        <div>
          <div>
            <div>
              Lái xe: <b style={{color: 'red'}}>{this.state.danhsachlaixeObj[this.state.chiphi.laixe].ten}</b>
            </div>
            <div>
              Biển kiểm soát: <b style={{color: 'red'}}>{this.state.chiphi.mapDO[0].xe}</b>
            </div>


            <div>
              Km chạy:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.km || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        km: value
                      }
                    }
                  })
                }}
              />


            </div>

            <div>
              Giá dầu:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.giadau || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        giadau: value
                      }
                    }
                  })
                }}
              />


            </div>

            <div>
              Số chuyến:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.sochuyen || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        sochuyen: value
                      }
                    }
                  })
                }}
              />
            </div>
            <div>
              Số tỉnh:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.sodautinh || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        sodautinh: value
                      }
                    }
                  })
                }}
              />
            </div>
            <div>
              Số điểm:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.sodiem || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        sodiem: value
                      }
                    }
                  })
                }}
              />
            </div>
            <div>
              Tiền cầu đường:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.cauduong || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        cauduong: value
                      }
                    }
                  })
                }}
              />
            </div>
            <div>
              Tiền bốc xếp:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.bocxep || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        bocxep: value
                      }
                    }
                  })
                }}
              />
            </div>
            <div>
              Tiền lưu đêm:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.luudem || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        luudem: value
                      }
                    }
                  })
                }}
              />
            </div>
            <div>
              Tiền luật:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.luat || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        luat: value
                      }
                    }
                  })
                }}
              />
            </div>
            <div>
              Phí khác:
              <InputNumber
                min={0}
                formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                parser={value => value.replace(/(,*)/g, '')}
                style={{width: '30%'}}
                placeholder="KM đầu"
                defaultValue={this.state.chiphi.phikhac || 0}
                onChange={(value) => {
                  if(parseInt(value).isNaN){
                    value = 0;
                  }

                  this.setState(prev => {
                    return {
                      ...prev,
                      chiphi: {
                        ...prev.chiphi,
                        phikhac: value
                      }
                    }
                  })
                }}
              />
            </div>
            <br/>
            <br/>
            <br/>
            <div>


              <Button type="primary"
                      style={{float: 'right'}}
                      onClick={() => {
                        let that = this;
                        agent.DieuHanh.capNhapChiPhi(this.state.chiphi)
                          .then(res => {
                            message.success('Cập nhập thành công')
                            // this.init()
                            modal.destroy()
                            that.init()
                          })
                      }}
              >Cập nhập</Button>

            </div>
            <br/>
            <br/>
          </div>
        </div>
      ),
      onOk() {},
      okText: "Đóng",
      afterClose() {
        alert('Close !!!')
      }
    });
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Home);


function tienmoichuyen(trongtai, sochuyen){
  if(trongtai < 9){
    return 50000
  } else {
    return 100000
  }
}

function tiendautinh(trongtai, sodautinh){
  if(trongtai <= 2){
    return sodautinh*40000
  } else if(trongtai <= 8){
    return sodautinh*50000
  } else {
    return sodautinh*60000
  }
}

function tiendiem(trongtai, sodiem){
  if(trongtai < 9){
    return sodiem*10000
  } else {
    return sodiem*50000
  }
}



function xemlenh(DO, thauphuObj) {
  Modal.info({
    width: 800,
    title: `Mã lệnh: ${DO._id}`,
    content: (
      <div>
        <div>
          Lái Xe: <b>{DO.mapLaixe.length > 0 ? (DO.mapLaixe[0].ten): ("Thầu phụ: " + thauphuObj[DO.thauphu].ten)}</b>
        </div>
        <div>
          Biển kiểm soát: <b>{DO.xe}</b>
        </div>
        <div>
          Ngày: <b>{moment(DO.date, 'YYYYMMDD').format('DD/MM/YYYY')}</b>
        </div>
        <div>
          Tỉnh đi: <b>{DO.tinhxuatphat ? DO.tinhxuatphat.name : "Hà nội"}</b>
        </div>
        <div>
          Tỉnh đến: <b>{DO.tinhtrahang.name}</b>
        </div>
        <div>
          Điểm đi: (<b style={{color: 'red'}}>{DO.diemxuatphat.length} </b> điểm)
          <div style={{paddingLeft: 10}}>
            {DO.diemxuatphat.map((el, index) => {
              return (
                <div>
                  <b style={{color: DO.diembatdau === index ? "red": "black"}}> + {el.name} {DO.diembatdau === index ? "(*)": ""}</b>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          Điểm đến: (<b style={{color: 'red'}}>{DO.diemtrahang.length} </b> điểm)
          <table style={{border: '1px solid #ddd', width: '100%'}}>
            <tbody>
            {DO.diemtrahang.map((el, index) => {
              return (
                <tr
                >
                  <td
                    style={{borderBottom: '1px solid #ddd', color: DO.diemxanhat === index ? "red": "black"}}
                  ><b>+ {el.name} {DO.diemxanhat === index ? "(*)": ""}</b></td>
                </tr>
              )
            })}
            </tbody></table>
        </div>
        <div>
          Trọng tải: <b style={{color: 'red'}}>{DO.trongtai} </b>tấn
        </div>
        <div>
          Trạng thái:
          <b>
            {DO.tinhtrang === 2 && "Đã nhận"}
            {DO.tinhtrang === 3 && "Hoàn thành"}
            {DO.tinhtrang === 5 && "Điều rỗng"}
            {DO.tinhtrang === 6 && "Hủy chuyến"}
          </b>
        </div>
        <div>
          Ghi chú: <b>{DO.ghichu}</b>
        </div>
      </div>
    ),
    onOk() {},
  });
}