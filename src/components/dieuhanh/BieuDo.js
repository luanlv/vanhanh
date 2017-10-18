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

const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];
const SimpleBarChart = React.createClass({
  render () {
    return (
      <BarChart width={800} height={300} data={data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    );
  }
})

const SimpleAreaChart = React.createClass({
  render () {
    return (
      <div>
        <h4>A demo of synchronized AreaCharts</h4>
        <AreaChart width={600} height={200} data={data} syncId="anyId"
                   margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Area type='monotone' dataKey='uv' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
        <p>Maybe some other content</p>
        <AreaChart width={600} height={200} data={data} syncId="anyId"
                   margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Area type='monotone' dataKey='pv' stroke='#82ca9d' fill='#82ca9d' />
        </AreaChart>
      </div>
    );
  }
})



class BieuDo extends React.Component {
  
  constructor(props){
    
    super(props)
    
    this.state = {
      startValue: moment(Date.now()).format('YYYYMMDD'),
      endValue: moment(Date.now()).format('YYYYMMDD'),
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
    const DO = await agent.DieuHanh.getThongKe(this.state.startValue, this.state.endValue, this.state.khachhang)
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
        <RangePicker
          defaultValue={[moment(startValue, 'YYYYMMDD'), moment(endValue, 'YYYYMMDD')]}
          format={'DD/MM/YYYY'}
          onChange={this.onChangeRange}
        />
        <Select
          style={{width: 250}}
          value={this.state.khachhang}
          onChange={this.changeKhachHang}
        >
          <Option key="tatca" value="tatca">Tất cả ({this.state.do.length})</Option>
          {khachhang.map((el, idx) => {
            return <Option key={idx} value={el.code}>{el.value} ({ this.state.do.filter((e) => {return e.khachhang == el.code}).length})</Option>
          })}
        </Select>
        <span> | </span>
        <Input style={{width: 200}}
               placeholder="Mã lệnh"
               onChange={(e) => {
                 let value = e.target.value
                 this.setState({
                   malenh: value
                 }, () => {
                   // alert(this.state.malenh)
                 })
               }}
        />
        <Button
          onClick={this.xemLenh}
        >Xem thông tin</Button>

        <div style={{float: 'right'}}>
          <a href={`${agent.API_ROOT}/dieuhanh/do/excel?start=${moment(this.state.startValue).format('YYYYMMDD')}&end=${moment(this.state.endValue).format('YYYYMMDD')}&khachhang=${this.state.khachhang}`} target="_blank"><Button>Xuất Excel</Button></a>
        </div>

        <hr/>
          <SimpleBarChart />
          <br/>
          <SimpleAreaChart/>
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

  onChangeRange = (dates, datesString) => {
    let that = this;
    this.setState({
      startValue: dates[0].format('YYYYMMDD'),
      endValue: dates[1].format('YYYYMMDD'),

    }, () => {
      that.init()
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BieuDo);


const khachhang = [
  {code: '101', value: 'VM'},
  {code: '102', value: 'LENSON'},
  {code: '103', value: 'KH NẤM'},
  {code: '104', value: 'THÁI PHÚ MINH'},
  {code: '105', value: 'BTC'},
  {code: '106', value: 'ĐÔNG ĐÔ'},
  {code: '107', value: 'KH SỮA CHƯƠNG MỸ'},
  {code: '108', value: 'SAIKO'},
  {code: '109', value: 'MAIKATECH'},
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