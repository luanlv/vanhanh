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
      startValue: moment(Date.now()).format('YYYYMMDD'),
      endValue: moment(Date.now()).format('YYYYMMDD'),
      khachhang: 'tatca',
      laixe: 'tatca',
      thauphu: 'tatca',
      endOpen: false,
      init: false,
      loadingText: '...',

      danhsachthauphu: [],
      danhsachthauphuObj: {},

      danhsachlaixe: [],
      danhsachlaixeObj: {},
      
      do: []
    }
    bindAll(this, 'init', 'changeKhachHang', 'changeLaiXe', 'changeThauPhu', 'onChangeRange', 'handleChange' )
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
        khachhangeObj: khachhangObj,
        filteredInfo: null,
        init: true,
      }
    })

  }
  
  init = async () => {
    const DO = await agent.DieuHanh.getThongKeThauPhu(this.state.startValue, this.state.endValue, this.state.thauphu)
    this.setState({
      do: DO
    })
  }

  xemLenh = async () => {
    const DO = await agent.DieuHanh.doById(this.state.malenh)
    if (DO && DO.length > 0) {
      info(DO[0], this.state.danhsachthauphuObj)
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
    // console.log(this.state.do)
    let laixeFilter=[]
    let xeFilter=[]
    let khachHangFilter=[]
    this.state.do.forEach((el) => {
      if(laixeFilter.findIndex(i => {i.value === el.laixe}) < 0){
        laixeFilter.push({key: el.laixe, text: that.state.danhsachlaixeObj[el.laixe].ten + ' - ' + that.state.danhsachlaixeObj[el.laixe].ma, value: el.laixe } )
      }
      if(xeFilter.findIndex(i => {i.value === el.xe}) < 0){
        xeFilter.push({key: el.xe, text: el.xe, value: el.xe } )
      }
      if(khachHangFilter.findIndex(i => {i.value === el.khachhang}) < 0){
        khachHangFilter.push({key: el.khachhang, text: el.mapKhachhang[0] ? el.mapKhachhang[0].value : '', value: el.khachhang } )
      }
    })
    // console.log(laixeFilter)
    // console.log(this.state.filteredInfo)

    let DOs = this.state.do
    if(this.state.filteredInfo && this.state.filteredInfo.laixe && this.state.filteredInfo.laixe.length > 0){
      DOs = DOs.filter(el => {return this.state.filteredInfo.laixe.indexOf(el.laixe + '') >= 0})
    }

    if(this.state.filteredInfo && this.state.filteredInfo.xe && this.state.filteredInfo.xe.length > 0){
      DOs = DOs.filter(el => {return this.state.filteredInfo.xe.indexOf(el.xe + '') >= 0})
    }

    if(this.state.filteredInfo && this.state.filteredInfo.tenkhachhang && this.state.filteredInfo.tenkhachhang.length > 0){
      DOs = DOs.filter(el => {return this.state.filteredInfo.tenkhachhang.indexOf(el.khachhang + '') >= 0})
    }
    return (
      <div>
        <h5 style={{textAlign: 'center'}}>Báo cáo theo thầu phụ</h5>
        {/*<DatePicker*/}
          {/*disabledDate={this.disabledStartDate}*/}
          {/*format="DD/MM/YYYY"*/}
          {/*value={startValue}*/}
          {/*placeholder="Bắt đầu"*/}
          {/*onChange={this.onStartChange}*/}
          {/*onOpenChange={this.handleStartOpenChange}*/}
        {/*/>*/}
        {/*<DatePicker*/}
          {/*disabledDate={this.disabledEndDate}*/}
          {/*format="DD/MM/YYYY"*/}
          {/*value={endValue}*/}
          {/*placeholder="Kết thúc"*/}
          {/*onChange={this.onEndChange}*/}
          {/*open={endOpen}*/}
          {/*onOpenChange={this.handleEndOpenChange}*/}
        {/*/>*/}
        <RangePicker
          defaultValue={[moment(startValue, 'YYYYMMDD'), moment(endValue, 'YYYYMMDD')]}
          format={'DD/MM/YYYY'}
          onChange={this.onChangeRange}
        />
        <Select
          style={{width: 250}}
          value={this.state.thauphu}
          onChange={this.changeThauPhu}
        >
          <Option key="tatca" value="tatca">Tất cả { this.state.laixe === 'tatca' && <span style={{color: 'red', fontWeight: 'bold'}}>({DOs.length})</span> }</Option>
          { this.state.danhsachthauphu.map((el, idx) => {
              let length = DOs.filter((e) => {return e.thauphu == el.ma}).length
              return (<Option key={idx} value={el.ma}>{el.ten} { length > 0 && <span style={{color: 'red', fontWeight: 'bold'}}>({length})</span> }</Option>)
            })
          }


        </Select>

        <div style={{float: 'right'}}>
          <a href={`${agent.API_ROOT}/dieuhanh/do/exceltheothauphu?start=${moment(this.state.startValue).format('YYYYMMDD')}&end=${moment(this.state.endValue).format('YYYYMMDD')}&thauphu=${this.state.thauphu}`} target="_blank"><Button>Xuất Excel</Button></a>
        </div>

        <hr/>

        <Row>
          <Table dataSource={this.state.do} size="small"
                 indentSize={30}
                 pagination={{pageSize: 100}}
                 onRowDoubleClick={(record, index, event) => {
                   info(record, this.state.danhsachthauphuObj)
                 }}
                 onChange={this.handleChange}
                 bordered={true}
          >
            
            <ColumnGroup title="Lệnh điều xe">
              <Column
                title="Ngày"
                key="phongban"
                render={(text, record) => (
                  <span
                    style={{color: record.quaydau ? "red" : "blue"}}
                  >
                    {moment(record.date, 'YYYYMMDD').format('DD/MM/YYYY')}
                  </span>
                )}
              />

              <Column
                title="Mã lệnh"
                dataIndex="_id"
                key="_id"
                render={(text, record) => (
                  <span
                    style={{color: record.quaydau ? "red" : "blue"}}
                  >
                    {record._id}
                  </span>
                )}
              />

              <Column
                title="Biển số xe"
                dataIndex="xe"
                key="xe"
                filters={xeFilter}
                onFilter={(value, record) => {
                  return record.xe == value
                }}
              />
  
              <Column
                title="Lái xe"
                key="laixe"
                filters={laixeFilter}
                onFilter={(value, record) => {
                  return record.laixe == value
                }}
                render={(text, record) => (
                  <span>
                    {this.state.danhsachlaixeObj[record.laixe].ten}
                  </span>
                )}
              />

  
              <Column
                title="Tên khách hàng"
                key="tenkhachhang"
                filters={khachHangFilter}
                onFilter={(value, record) => {
                  return record.khachhang == value
                }}
                render={(text, record) => (
                  <span>
                    {record.mapKhachhang[0] ? record.mapKhachhang[0].value : ''}
                  </span>
                )}
              />
              <Column
                title="Tỉnh đi"
                key="tinhdi"
                render={(text, record) => (
                  <span>
                    {record.tinhxuatphat ? record.tinhxuatphat.name : "Hà nội"}
                  </span>
                )}
              />
              <Column
                title="Tỉnh đến"
                key="diemden"
                render={(text, record) => (
                  <span>
                    {record.tinhtrahang ? record.tinhtrahang.name : "Hà nội"}
                  </span>
                )}
              />

              <Column
                title="Trọng tải (tấn)"
                key="trongtai"
                render={(text, record) => (
                  <span>
                    {record.trongtai}
                  </span>
                )}
              />

              <Column
                title="Trọng tải thực"
                key="trongtaithuc"
                render={(text, record) => (
                  <span>
                    {record.trongtaithuc}
                  </span>
                )}
              />

              <Column
                title="CBM"
                // dataIndex="cbm"
                key="trongtai"
                render={(text, record) => (
                  <span>
                    {record.cbm}
                  </span>
                )}
              />
  
  
              <Column
                title="Số điểm rớt"
                key="diemrot"
                render={(text, record) => (
                  <span>
                    {record.diemtrahang.length + (record.diemxuatphat.length - 1)}
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
              <Column
                width={150}
                title="Ghi chú"
                // dataIndex="ghichu"
                key="ghichu"
                render={(text, record) => (
                  <span>
                    {record.ghichu.slice(0, 30)} {record.ghichu.length > 30 ? "..." : ""}
                  </span>
                )}
              />

            </ColumnGroup>
          </Table>
        </Row>
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
  changeKhachHang = async (value) => {
    // console.log(value)
    await this.setState({khachhang: value})
    this.init()
  }
  changeLaiXe = async (value) => {
    // console.log(value)
    await this.setState({laixe: value})
    this.init()
  }
  changeThauPhu = async (value) => {
    // console.log(value)
    await this.setState({thauphu: value})
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);



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

function info(DO, thauphuObj) {
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