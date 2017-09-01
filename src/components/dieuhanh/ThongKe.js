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

class Home extends React.Component {
  
  constructor(props){
    
    super(props)
    
    this.state = {
      startValue: moment(Date.now()),
      endValue: moment(Date.now()),
      khachhang: 'tatca',
      endOpen: false,
      init: false,
      loadingText: '...',

      danhsachthauphu: [],
      danhsachthauphuObj: {},

      danhsachlaixe: [],
      danhsachlaixeObj: {},
      
      do: []
    }
    bindAll(this, 'init', 'changeKhachHang')
    this.init()
  }
  
  componentWillMount = async () => {
    
    
    
    
    const danhsachthauphu = await agent.DieuHanh.danhSachThauPhu()
    let danhsachthauphuObj = {}

    danhsachthauphu.map(el => {
      danhsachthauphuObj[el.ma] = el
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
        init: true,
      }
    })
    
  }
  
  init = async () => {
    const DO = await agent.DieuHanh.getThongKe(moment(this.state.startValue).format('YYYYMMDD'), moment(this.state.endValue).format('YYYYMMDD'), this.state.khachhang)
    this.setState({
      do: DO
    })
  }
  
  render() {
    const role = this.props.user.role;
    
    if(!this.state.init){
      return (
        <div>
          {this.state.loadingText}
        </div>
      )
    }
  
    const { startValue, endValue, endOpen } = this.state;
    
    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          format="DD/MM/YYYY"
          value={startValue}
          placeholder="Bắt đầu"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          format="DD/MM/YYYY"
          value={endValue}
          placeholder="Kết thúc"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
        
        <Select
          style={{width: 250}}
          value={this.state.khachhang}
          onChange={this.changeKhachHang}
        >
          <Option key="tatca" value="tatca">Tất cả</Option>
          {khachhang.map((el, idx) => {
            return <Option key={idx} value={el.code}>{el.value}</Option>
          })}
        </Select>
        
        <hr/>
        <Row>
          <Table dataSource={this.state.do}>
            
            <ColumnGroup title="Name">
              <Column
                title="Ngày"
                key="phongban"
                render={(text, record) => (
                  <span>
                    {moment(record.date, 'YYYYMMDD').format('DD/MM/YYYY')}
                  </span>
                )}
              />
              
              <Column
                title="Mã lệnh"
                dataIndex="_id"
                key="_id"
              />
              
              <Column
                title="Biển số xe"
                dataIndex="xe"
                key="xe"
              />
  
              <Column
                title="Lái xe"
                key="laixe"
                render={(text, record) => (
                  <span>
                    {this.state.danhsachlaixeObj[record.laixe].ten}
                  </span>
                )}
              />
  
              <Column
                title="Mã KH"
                dataIndex="khachhang"
                key="khachhang"
              />
  
              <Column
                title="Tên khách hàng"
                key="tenkhachhang"
                render={(text, record) => (
                  <span>
                    {(khachhangObj[record.khachhang] || {}).value}
                  </span>
                )}
              />
              <Column
                title="Điểm đi"
                key="tinhdi"
                render={(text, record) => (
                  <span>
                    {record.diemxuatphat.tinh.name}
                  </span>
                )}
              />
              <Column
                title="Điểm đến"
                key="diemden"
                render={(text, record) => (
                  <span>
                    {record.tinhtrahang.name}
                  </span>
                )}
              />
  
  
              <Column
                title="Trọng tải"
                dataIndex="trongtai"
                key="trongtai"
              />
  
  
              <Column
                title="Số điểm rớt"
                key="diemrot"
                render={(text, record) => (
                  <span>
                    {record.diemtrahang.length}
                  </span>
                )}
              />
              
              <Column
                title="Trạng thái"
                key="trangthai"
                render={(text, record) => (
                  <span>
                    {record.tinhtrang === 2 && "Đã nhận"}
                    {record.tinhtrang === 3 && "Hoàn thành"}
                    {record.tinhtrang === 5 && "Điều rỗng"}
                    {record.tinhtrang === 6 && "Hủy chuyến"}
                  </span>
                )}
              />
              
              <Column
                title="Thu hộ"
                dataIndex="tienthu"
                key="tienthu"
              />
              <Column
                title="Phí khác"
                dataIndex="tienphatsinh"
                key="tienphatsinh"
              />

            </ColumnGroup>
          </Table>
        </Row>
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
    return endValue.valueOf() <= startValue.valueOf();
  }
  
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  changeKhachHang = async (value) => {
    await this.setState({khachhang: value})
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
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);


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