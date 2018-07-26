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
import {slugify} from '../_function'
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

      danhsachxe: [],
      danhsachxeObj: {},
      
      do: []
    }
    bindAll(this, 'init', 'changeKhachHang', 'changeLaiXe', 'changeThauPhu', 'onChangeRange', 'handleChange' )
  }
  
  componentWillMount = async () => {

    const danhsachxe = await agent.DieuHanh.danhsachxe()
    let danhsachxeObj = {}
    danhsachxe.map(el => {
      danhsachxeObj[el.bks] = el
    })

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
        danhsachxe: danhsachxe,
        danhsachxeObj: danhsachxeObj,
        filteredInfo: null,
        init: true,
      }
    })
    this.init()
  }
  
  init = async () => {
    const DO = await agent.DieuHanh.getThongKeThauPhu(this.state.startValue, this.state.endValue, this.state.thauphu)
    const chiphiData = await agent.LaiXe.daKhaiBao(this.state.startValue, this.state.endValue, 'tatca')
    let chiphiObj = {}

    chiphiData.map(chiphi => {
      if(chiphi.timedieuhanh){
        chiphiObj[chiphi.do] = {}
        if(this.state.danhsachxeObj[chiphi.mapDO[0].xe]){
          chiphi.dinhmuc = this.state.danhsachxeObj[chiphi.mapDO[0].xe].dm
          chiphiObj[chiphi.do].chiphi = chiphi.sodautinh > 0 ? (Math.floor(chiphi.kmdh*chiphi.dinhmuc*chiphi.giadaudh/100) + tiendautinh(chiphi.mapDO[0].trongtai, chiphi.sodautinhdh) + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiemdh) + chiphi.cauduongdh + chiphi.bocxepdh + chiphi.luudemdh + chiphi.luatdh + chiphi.phikhacdh)
            : (Math.floor(chiphi.kmdh*chiphi.dinhmuc*chiphi.giadaudh/100) + tienmoichuyen(chiphi.mapDO[0].trongtai, chiphi.sochuyendh)  + tiendiem(chiphi.mapDO[0].trongtai, chiphi.sodiemdh) + chiphi.cauduongdh + chiphi.bocxepdh + chiphi.luudemdh + chiphi.luatdh + chiphi.phikhacdh)
        } else {
          chiphiObj[chiphi.do].chiphi = 0
        }
      }
    })
    this.setState({
      do: DO,
      chiphiObj: chiphiObj
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
      if(laixeFilter.findIndex(i => {return i.value === el.laixe}) < 0){
        laixeFilter.push({key: el.laixe, text: that.state.danhsachlaixeObj[el.laixe].ten + ' - ' + that.state.danhsachlaixeObj[el.laixe].ma, value: el.laixe } )
      }
      if(xeFilter.findIndex(i => {return i.value === el.xe}) < 0){
        xeFilter.push({key: el.xe, text: el.xe, value: el.xe } )
      }
      if(khachHangFilter.findIndex(i => {return i.value === el.khachhang}) < 0){
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

    let DT = intersection(role, [301, 303]).length > 0 && this.state.endValue >= 20180101
    let sum = 0
    let sumChiPhi = 0
    let _sum = 0
    let _sumChiPhi = 0
    if(DT){
      DOs.map(el => {
        if((el.doanhthu || []).length > 0) {
          sum += el.doanhthu[0]
        } else {
          _sum += 1
        }
        if(this.state.chiphiObj[el._id]){
          if(this.state.chiphiObj[el._id].chiphi > 0){
            sumChiPhi += this.state.chiphiObj[el._id].chiphi
          } else {
            _sumChiPhi += 1
          }
        } else {
          _sumChiPhi += 1
        }
      })
    }

    return (
      <div>
        <h5 style={{textAlign: 'center'}}>Báo cáo theo thầu phụ</h5>

        <RangePicker
          defaultValue={[moment(startValue, 'YYYYMMDD'), moment(endValue, 'YYYYMMDD')]}
          format={'DD/MM/YYYY'}
          onChange={this.onChangeRange}
        />
        <Select
          showSearch
          filterOption={(input, option) => slugify(option.props.children[0]).toLowerCase().indexOf(slugify(input.toLowerCase())) >= 0}
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
        <br/>
        <div style={{float: 'right'}}>
          <a href={`${agent.API_ROOT}/dieuhanh/do/exceltheothauphu?start=${moment(this.state.startValue).format('YYYYMMDD')}&end=${moment(this.state.endValue).format('YYYYMMDD')}&thauphu=${this.state.thauphu}&doanhthu=${intersection(role, [301, 303]).length}`} target="_blank"><Button>Xuất Excel chi tiết</Button></a>
        </div>
        <div style={{float: 'right'}}>
          <a href={`${agent.API_ROOT}/dieuhanh/do/exceltheothauphurutgon?start=${moment(this.state.startValue).format('YYYYMMDD')}&end=${moment(this.state.endValue).format('YYYYMMDD')}&thauphu=${this.state.thauphu}&doanhthu=${intersection(role, [301, 303]).length}`} target="_blank"><Button>Xuất Excel rút gọn</Button></a>
        </div>
        <br/>
        {DT && <div style={{fontSize: 16}}>
          Doanh thu: <span style={{color: 'green'}}>{sum.toLocaleString()} đ</span>
          {_sum > 0 && <span> (thiếu {_sum} chuyến)</span>}
        </div>}
        {DT && <div style={{fontSize: 16}}>
          Chi phí: <span style={{color: 'red'}}>{sumChiPhi.toLocaleString()} đ</span>
          {_sumChiPhi > 0 && <span> (thiếu {_sumChiPhi} chuyến)</span>}
        </div>}
        {DT && <div style={{fontSize: 16}}>
          DT - CP: <span style={{color: 'green'}}>{(sum - sumChiPhi).toLocaleString()} đ</span>
        </div>}
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

              {(intersection(role, [301, 303]).length > 0) &&  this.state.endValue >= 20180101 &&
              <Column
                title="Doanh thu"
                dataIndex="doanhthu"
                key="doanhthu"
                render={(text, record) => (
                  <span
                    style={{color: "red", fontWeight: 'bold'}}
                  >
                    {tinhdoanhthu(record).toLocaleString()}
                  </span>
                )}
              />
              }
              {(intersection(role, [301, 303]).length > 0) &&  this.state.endValue >= 20180101 &&
              <Column
                title="Chi phí"
                dataIndex="chiphi"
                key="chiphi"
                width={100}
                render={(text, record) => (
                  <span
                    style={{color: "red", fontWeight: 'bold'}}
                  >
                    {this.state.chiphiObj[record._id] ? this.state.chiphiObj[record._id].chiphi.toLocaleString() : 0}
                    </span>
                )}
              />
              }
              {(intersection(role, [301, 303]).length > 0) &&  this.state.endValue >= 20180101 &&
              <Column
                title="DT-CP"
                dataIndex="DT-CP"
                key="DT-CP"
                width={100}
                render={(text, record) => (
                  <span
                    style={{color: (record.doanhthu[0] - (this.state.chiphiObj[record._id] ? this.state.chiphiObj[record._id].chiphi : 0) > 0) ? "green" : "red", fontWeight: 'bold'}}
                  >
                    {(record.doanhthu[0] - (this.state.chiphiObj[record._id] ? this.state.chiphiObj[record._id].chiphi : 0)).toLocaleString()}
                    </span>
                )}
              />
              }

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
                render={(text, record) => {

                  if(record.tinhtrahang.slug === 'chua-phan'){
                    if(record.loai === 'noi') {
                      return (<span>
                        Nội Thành
                      </span>)
                    } else {
                      return (<span>
                        Ngoại Thành
                      </span>)
                    }
                  }

                  return (
                    <span>
                    {record.tinhtrahang ? record.tinhtrahang.name : "Hà nội"}
                  </span>
                  )
                }}
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

var banggia = [
  {
    "diemden": "Hà Nội Nội Thành",
    "km": 30,
    "1,5": "  480.000 ",
    "2,5": "  650.000 ",
    "3,5": "  850.000 ",
    "5": "  900.000 ",
    "8": "  1.000.000 ",
    "15": "  1.500.000 "
  },
  {
    "diemden": "Hà Nội Ngoại Thành",
    "km": 40,
    "1,5": "  520.000 ",
    "2,5": "  700.000 ",
    "3,5": "  900.000 ",
    "5": "  1.000.000 ",
    "8": "  1.100.000 ",
    "15": "  1.500.000 "
  },
  {
    "diemden": "Bắc Ninh ",
    "km": 30,
    "1,5": "  430.000 ",
    "2,5": "  550.000 ",
    "3,5": "  750.000 ",
    "5": "  850.000 ",
    "8": "  900.000 ",
    "15": "  1.500.000 "
  },
  {
    "diemden": "Vĩnh Phúc",
    "km": 70,
    "1,5": "  850.000 ",
    "2,5": "  980.000 ",
    "3,5": "  1.260.000 ",
    "5": "  1.400.000 ",
    "8": "  1.750.000 ",
    "15": "  2.000.000 "
  },
  {
    "diemden": "Hà Nam",
    "km": 75,
    "1,5": "  850.000 ",
    "2,5": "  980.000 ",
    "3,5": "  1.260.000 ",
    "5": "  1.400.000 ",
    "8": "  1.750.000 ",
    "15": "  2.000.000 "
  },
  {
    "diemden": "Hưng Yên",
    "km": 65,
    "1,5": "  720.000 ",
    "2,5": "  840.000 ",
    "3,5": "  1.080.000 ",
    "5": "  1.200.000 ",
    "8": "  1.500.000 ",
    "15": "  2.000.000 "
  },
  {
    "diemden": "Bắc Giang",
    "km": 40,
    "1,5": "  520.000 ",
    "2,5": "  700.000 ",
    "3,5": "  900.000 ",
    "5": "  1.100.000 ",
    "8": "  1.200.000 ",
    "15": "  1.500.000 "
  },
  {
    "diemden": "Thái Nguyên",
    "km": 60,
    "1,5": "  720.000 ",
    "2,5": "  840.000 ",
    "3,5": "  1.080.000 ",
    "5": "  1.200.000 ",
    "8": "  1.500.000 ",
    "15": "  2.000.000 "
  },
  {
    "diemden": "Hải Dương ",
    "km": 80,
    "1,5": "  950.000 ",
    "2,5": "  1.120.000 ",
    "3,5": "  1.440.000 ",
    "5": "  1.600.000 ",
    "8": "  2.000.000 ",
    "15": "  2.400.000 "
  },
  {
    "diemden": "Hòa Bình",
    "km": 100,
    "1,5": "  1.200.000 ",
    "2,5": "  1.400.000 ",
    "3,5": "  1.800.000 ",
    "5": "  2.000.000 ",
    "8": "  2.500.000 ",
    "15": "  3.000.000 "
  },
  {
    "diemden": "Phú Thọ",
    "km": 120,
    "1,5": "  1.450.000 ",
    "2,5": "  1.700.000 ",
    "3,5": "  2.150.000 ",
    "5": "  2.400.000 ",
    "8": "  3.000.000 ",
    "15": "  3.600.000 "
  },
  {
    "diemden": "Nam Định",
    "km": 120,
    "1,5": "  1.450.000 ",
    "2,5": "  1.700.000 ",
    "3,5": "  2.150.000 ",
    "5": "  2.400.000 ",
    "8": "  3.000.000 ",
    "15": "  3.600.000 "
  },
  {
    "diemden": "Ninh Bình",
    "km": 120,
    "1,5": "  1.450.000 ",
    "2,5": "  1.700.000 ",
    "3,5": "  2.150.000 ",
    "5": "  2.400.000 ",
    "8": "  3.000.000 ",
    "15": "  3.600.000 "
  },
  {
    "diemden": "Hải Phòng",
    "km": 120,
    "1,5": "  1.450.000 ",
    "2,5": "  1.700.000 ",
    "3,5": "  2.150.000 ",
    "5": "  2.400.000 ",
    "8": "  3.000.000 ",
    "15": "  3.600.000 "
  },
  {
    "diemden": "Thái Bình",
    "km": 120,
    "1,5": "  1.450.000 ",
    "2,5": "  1.700.000 ",
    "3,5": "  2.150.000 ",
    "5": "  2.400.000 ",
    "8": "  3.000.000 ",
    "15": "  3.600.000 "
  },
  {
    "diemden": "Thanh Hóa",
    "km": 180,
    "1,5": "  2.160.000 ",
    "2,5": "  2.520.000 ",
    "3,5": "  3.240.000 ",
    "5": "  3.600.000 ",
    "8": "  4.500.000 ",
    "15": "  5.400.000 "
  },
  {
    "diemden": "Lạng Sơn",
    "km": 160,
    "1,5": "  1.920.000 ",
    "2,5": "  2.240.000 ",
    "3,5": "  2.880.000 ",
    "5": "  3.200.000 ",
    "8": "  4.000.000 ",
    "15": "  4.800.000 "
  },
  {
    "diemden": "Bắc Kạn",
    "km": 185,
    "1,5": "  2.220.000 ",
    "2,5": "  2.590.000 ",
    "3,5": "  3.330.000 ",
    "5": "  3.700.000 ",
    "8": "  4.625.000 ",
    "15": "  5.550.000 "
  },
  {
    "diemden": "Quảng Ninh",
    "km": 190,
    "1,5": "  2.280.000 ",
    "2,5": "  2.660.000 ",
    "3,5": "  3.420.000 ",
    "5": "  3.800.000 ",
    "8": "  4.750.000 ",
    "15": "  5.700.000 "
  },
  {
    "diemden": "Tuyên Quang",
    "km": 200,
    "1,5": "  2.400.000 ",
    "2,5": "  2.800.000 ",
    "3,5": "  3.600.000 ",
    "5": "  4.000.000 ",
    "8": "  5.000.000 ",
    "15": "  6.000.000 "
  },
  {
    "diemden": "Yên Bái",
    "km": 200,
    "1,5": "  2.400.000 ",
    "2,5": "  2.800.000 ",
    "3,5": "  3.600.000 ",
    "5": "  4.000.000 ",
    "8": "  5.000.000 ",
    "15": "  6.000.000 "
  },
  {
    "diemden": "Lào Cai",
    "km": 270,
    "1,5": "  3.240.000 ",
    "2,5": "  3.780.000 ",
    "3,5": "  4.860.000 ",
    "5": "  5.400.000 ",
    "8": "  6.750.000 ",
    "15": "  8.100.000 "
  },
  {
    "diemden": "Cao Bằng",
    "km": 280,
    "1,5": "  3.360.000 ",
    "2,5": "  3.920.000 ",
    "3,5": "  5.040.000 ",
    "5": "  5.600.000 ",
    "8": "  7.000.000 ",
    "15": "  8.400.000 "
  },
  {
    "diemden": "Hà Giang",
    "km": 300,
    "1,5": "  3.600.000 ",
    "2,5": "  4.200.000 ",
    "3,5": "  5.400.000 ",
    "5": "  6.000.000 ",
    "8": "  7.500.000 ",
    "15": "  9.000.000 "
  },
  {
    "diemden": "Nghệ An",
    "km": 335,
    "1,5": "  4.020.000 ",
    "2,5": "  4.690.000 ",
    "3,5": "  6.030.000 ",
    "5": "  6.700.000 ",
    "8": "  8.375.000 ",
    "15": "  10.050.000 "
  },
  {
    "diemden": "Sơn La",
    "km": 350,
    "1,5": "  4.200.000 ",
    "2,5": "  4.900.000 ",
    "3,5": "  6.300.000 ",
    "5": "  7.000.000 ",
    "8": "  8.750.000 ",
    "15": "  10.500.000 "
  },
  {
    "diemden": "Hà Tĩnh",
    "km": 365,
    "1,5": "  4.380.000 ",
    "2,5": "  5.110.000 ",
    "3,5": "  6.570.000 ",
    "5": "  7.300.000 ",
    "8": "  9.125.000 ",
    "15": "  10.950.000 "
  },
  {
    "diemden": "Lai Châu",
    "km": 430,
    "1,5": "  5.160.000 ",
    "2,5": "  6.020.000 ",
    "3,5": "  7.740.000 ",
    "5": "  8.600.000 ",
    "8": "  10.750.000 ",
    "15": "  12.900.000 "
  },
  {
    "diemden": "Điện Biên",
    "km": 530,
    "1,5": "  6.360.000 ",
    "2,5": "  7.420.000 ",
    "3,5": "  9.540.000 ",
    "5": "  10.600.000 ",
    "8": "  13.250.000 ",
    "15": "  15.900.000 "
  },
  {
    "diemden": "Quảng Bình",
    "km": 490,
    "1,5": "  5.880.000 ",
    "2,5": "  6.860.000 ",
    "3,5": "  8.820.000 ",
    "5": "  9.800.000 ",
    "8": "  12.250.000 ",
    "15": "  14.700.000 "
  },
  {
    "diemden": "Quảng Trị",
    "km": 640,
    "1,5": "  7.680.000 ",
    "2,5": "  8.960.000 ",
    "3,5": "  11.520.000 ",
    "5": "  12.800.000 ",
    "8": "  16.000.000 ",
    "15": "  19.200.000 "
  },
  {
    "diemden": "Thừa Thiên Huế",
    "km": 670,
    "1,5": "  8.040.000 ",
    "2,5": "  9.380.000 ",
    "3,5": "  12.060.000 ",
    "5": "  13.400.000 ",
    "8": "  16.750.000 ",
    "15": "  20.100.000 "
  },
  {
    "diemden": "Đà Nẵng",
    "km": 770,
    "1,5": "  9.240.000 ",
    "2,5": "  10.780.000 ",
    "3,5": "  13.860.000 ",
    "5": "  15.400.000 ",
    "8": "  19.250.000 ",
    "15": "  23.100.000 "
  },
  {
    "diemden": "Quảng Nam ",
    "km": 850,
    "1,5": "  10.200.000 ",
    "2,5": "  11.900.000 ",
    "3,5": "  15.300.000 ",
    "5": "  17.000.000 ",
    "8": "  21.250.000 ",
    "15": "  25.500.000 "
  },
  {
    "diemden": "Quảng Ngãi",
    "km": 920,
    "1,5": "  11.040.000 ",
    "2,5": "  12.880.000 ",
    "3,5": "  16.560.000 ",
    "5": "  18.400.000 ",
    "8": "  23.000.000 ",
    "15": "  27.600.000 "
  }
]

function tinhdoanhthu(lenh){
  console.log(lenh.diemxuatphat.length + lenh.diemtrahang.length)
  console.log(lenh.trongtaithuc)
  console.log(lenh.tinhtrahang.name.toLowerCase())
  console.log(lenh.loai)
  let gia = {}
  if(lenh.loai === "ngoai"){
    gia = banggia[1]
  } else if (lenh.loai === "noi"){
      gia = banggia[0]
  } else {
    gia = banggia.find(el => {
      return el.diemden.toLowerCase() === lenh.tinhtrahang.name.toLowerCase()
    })
    if(!gia) gia = {}
  }
  let trongtai = lenh.trongtaithuc <= 1.5 ? "1,5" : lenh.trongtaithuc < 2.5 ? "2,5" : lenh.trongtaithuc < 3.5 ? "3,5" : lenh.trongtaithuc < 5 ? "5" : lenh.trongtaithuc < 8 ? "8" : "15"
  if(!gia[trongtai]) gia[trongtai] = '0'
  let giatrongtai = parseInt(gia[trongtai].replace(/\./g, ''))
  // console.log(gia)
  // console.log(giatrongtai)
  // console.log(lenh)
  return giatrongtai;
}


