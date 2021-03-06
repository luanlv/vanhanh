import React from 'react';
import PropTypes from 'prop-types';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import Status from './component/Status'
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import {intersection, debounce} from 'lodash'

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio, Tabs, Popconfirm, notification} from 'antd';
import DO from './DO'
import moment from 'moment'
import io from 'socket.io-client';

const openNotification = (mes) => {
  notification.open({
    message: mes,
    // description: mes,
  });
};

var async = require('async')
const TabPane = Tabs.TabPane;

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  user: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      date: moment(Date.now()).format('YYYYMMDD'),
      date2: moment(Date.now()).format('YYYYMMDD'),
      init: false,
      visible: false,
      quaydau: false,
      data: {
        mien: 'bac'
      },
      phongban: [],
      DOs: [],
      loadingText: '...',
      action: 'them',
      thauphu: false,
      danhsachthauphu: [],
      thauphuOBJ: {},
      danhsachlaixe: [],
      laixeOBJ: {},
      danhsachxe: [],
      xeOBJ: {},
      tinhtrang: -1,
      edit: false,
      khachhang: [],
      khachhangObj: {},
    }
    // console.log(moment(Date.now()).format('YYYYMMDD'))

    this.changeDate = this.changeDate.bind(this)
    this.changeDate2 = this.changeDate2.bind(this)
    this.chinhsua = this.chinhsua.bind(this)
    this.onUpdate = this.onUpdate.bind(this
    )
    this.init(this.state.date, this.state.date2)
  }

  onUpdate = function(data){
  // console.log(data)
    let that = this
    openNotification(data.mes)
    that.initDO(that.state.date, that.state.date2)
  }

  componentDidMount(){
    let that = this
    this.context.socket.on('update', this.onUpdate);
    that.reload = setInterval(function(){
      that.setState({})
    }, 60000)
  }

  componentWillUnmount () {
    clearInterval(this.reload)
  }


  componentWillMount = async () => {
    this.context.socket.off('update', this.onUpdate);
    let that = this
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
      init: true
    })
  }

  initDO = async (date) => {
    // console.log('init DO')
    const DOs = await agent.DieuHanh.getDOs(date);
    this.setState({
      DOs: DOs,
    })
  }

  init = async (date) => {
    let that = this;
    try {
      // const date = await agent.DieuHanh.getDate();
      const DOs = await agent.DieuHanh.getDOs(date);
      const danhsachthauphu = await agent.DieuHanh.danhSachThauPhu();
      const danhsachlaixe = await agent.DieuHanh.danhsachlaixe()
      const danhsachxe = await agent.DieuHanh.danhsachxe()
      // console.log(date)
      if (DOs) {
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
          DOs: DOs,
          danhsachthauphu: danhsachthauphu,
          danhsachlaixe: danhsachlaixe,
          danhsachxe: danhsachxe,
          thauphuOBJ: tp,
          laixeOBJ: lx,
          init: true,
        })
      }
    }catch (e) {
      that.setState({
        loadingText: '' + e
      })
    }

  }

  changeDate = async (value) => {

    this.setState(prev => {
      return {
        ...prev,
        date: moment(value).format('YYYYMMDD')
      }}
    )

    this.initDO(moment(value).format('YYYYMMDD'), this.state.date2)
  }

  changeDate2 = async (value) => {

    this.setState(prev => {
      return {
        ...prev,
        date2: moment(value).format('YYYYMMDD')
      }}
    )

    this.initDO(this.state.date, moment(value).format('YYYYMMDD'))
  }

  render() {
    const role = this.props.user.role;

    let lenhcho = []
    let chuanhan = []
    let danhan = []
    let hoanthanh = []
    let dieurong = []
    let huy = []


    let cur = parseInt(moment(Date.now()).format('YYYYMMDD'))
    let select = parseInt(this.state.date)
    let editOk = true
    if(cur - select >= 2) editOk = false
    // if((cur - select >= 1) && moment().hour() >= 9) editOk = false
    if((cur - select >= 1) && moment().hour() >= 9) editOk = false

    if(moment().day() === 0 && cur - select <= 1){
      editOk = true;
    }

    if(moment().day() === 1 && cur - select <= 2 && moment().hour() < 9){
      editOk = true;
    }

    if(cur === 20180103 && this.props.user.ma === 1013){
      editOk = true;
    }

    // editOk = true;
    // alert(moment().hour() >= 6)
    // console.log(select)
    // console.log(cur)
    // console.log(select == cur)

    this.state.DOs.map((el, index) => {
      if(el.laixe === -1 || el.tinhtrang === 0){
        lenhcho.push(el)
      } else if(el.tinhtrang === 1){
        chuanhan.push(el)
      } else if(el.tinhtrang === 2){
        danhan.push(el)
      } else if(el.tinhtrang === 3){
        hoanthanh.push(el)
      } else if(el.tinhtrang === 5){
        dieurong.push(el)
      } else if(el.tinhtrang === 6){
        huy.push(el)
      }
    })

    if(!this.state.init){
      return (
        <div>
          {this.state.loadingText}
        </div>
      )
    }
    // console.log(this.state.danhsachthauphu)
    // console.log(this.state.danhsachthauphuObj)
    return (
      <div className="home-page" style={{marginTop: 10, padding: 10}}>

        <div style={{float: 'right', fontSize: 12}}>
          Ngày hiện tại: <b style={{color: 'red'}}>{moment(Date.now()).format('DD-MM-YYYY')}</b>
        </div>


        <h2 id="header" style={{textAlign: 'center', color: 'red'}}>{moment(this.state.date).format('DD-MM-YYYY')}
          <Status date={parseInt(this.state.date)} />
        </h2>

        {editOk && <span style={{marginRight: 5}}>
          <Button className="newDO" type="primary" onClick={this.showModal1}>COLOMBUS</Button>
        </span>}

        {editOk && <span style={{marginRight: 5}}>
          <Button className="newDO" type="primary" onClick={this.thauphu}>Thầu phụ</Button>
        </span>}

        {/*<span style={{marginRight: 5}}>*/}
          {/*<Button className="newDO" type="primary"*/}
            {/*onClick={async () => {*/}
              {/*let that = this;*/}
              {/*that.state.danhsachlaixe.map((el, idx) => {*/}
                {/*agent.DieuHanh.themDO(*/}
                  {/*{"loai":"noi","tinh":[],"sotinh":0,"lenhtruoc":0,"doitruong":null,"quaydau":false,"tienphatsinh":0,"tienthu":0,"trongtaithuc":3000,"cbm":0,"sokm":50,"sodiem":1,"thauphu":101,"khachhang": "106","nguoiyeucau": 103,"xe":"","laixe":"","tinhxuatphat":{"name":"Hà Nội","slug":"ha-noi","type":"thanh-pho","name_with_type":"Thành phố Hà Nội","code":"01"},"tinhtrahang":{"name":"...","slug":"chua-phan","type":"tinh","name_with_type":"...","code":"00"},"ghichu":"","date":20180708,"diemxuatphat":[{"_id":"59ae625760f6600538008a64","name":"Kho Đông Đô","code":"HN025","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"__v":0,"search":"kho dong do hn025","label":"Kho Đông Đô"}],"diemtrahang":[{"_id":"5ad988e7133710622cbe809f","name":"Tri Phương 1 , huyện Tiên Du, tỉnh Bắc Ninh,","code":"cucmpr4f","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"search":"tri phuong 1 huyen tien du tinh bac ninh cucmpr4f","__v":0,"label":"Tri Phương 1 , huyện Tiên Du, tỉnh Bắc Ninh,"},{"_id":"5b0924e66324207584a3d4e4","name":"ST – Cty CP TGDĐ-Mini - Trí Quả - Bắc Ninh","code":"dnjt60zi","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"search":"st cty cp tgdd-mini - tri qua - bac ninh dnjt60zi","__v":0,"label":"ST – Cty CP TGDĐ-Mini - Trí Quả - Bắc Ninh"},{"_id":"5aa936d694a6a6531880b574","name":"Vũ Ninh, tp Bấc Ninh","code":"vxq4cm51","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"search":"vu ninh tp bac ninh vxq4cm51","__v":0,"label":"Vũ Ninh, tp Bấc Ninh"}],"diembatdau":0,"diemxanhat":0,"trongtai":2.5}*/}
                {/*)*/}
                  {/*.then(res => {*/}
                    {/*console.log(res)*/}
                    {/*agent.DieuHanh.chonlaixe(*/}
                      {/*{"_id": res._id, "xe":"29C-85832", "date":20180708,"time":"2018-07-08T00:43:01.539Z","laixe": el.ma}*/}
                    {/*)*/}
                  {/*})*/}
                  {/*.catch(err => {*/}
                    {/*// message.error("Thêm mới that bai")*/}
                  {/*})*/}
              {/*})*/}
            {/*}}*/}
          {/*>Demo tất cả lái xe</Button>*/}
           {/*-*/}
          {/*<Button className="newDO" type="primary"*/}
                  {/*onClick={async () => {*/}
                    {/*let that = this;*/}
                    {/*let promptData = prompt("Please enter your name", "");*/}
                    {/*let laixe = parseInt(promptData)*/}
                    {/*if(that.state.danhsachlaixe.find(el => el.ma === laixe)){*/}
                      {/*agent.DieuHanh.themDO(*/}
                        {/*{"loai":"noi","tinh":[],"sotinh":0,"lenhtruoc":0,"doitruong":null,"quaydau":false,"tienphatsinh":0,"tienthu":0,"trongtaithuc":3000,"cbm":0,"sokm":50,"sodiem":1,"thauphu":101,"khachhang": "106","nguoiyeucau": 103,"xe":"","laixe":"","tinhxuatphat":{"name":"Hà Nội","slug":"ha-noi","type":"thanh-pho","name_with_type":"Thành phố Hà Nội","code":"01"},"tinhtrahang":{"name":"...","slug":"chua-phan","type":"tinh","name_with_type":"...","code":"00"},"ghichu":"","date":20180708,"diemxuatphat":[{"_id":"59ae625760f6600538008a64","name":"Kho Đông Đô","code":"HN025","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"__v":0,"search":"kho dong do hn025","label":"Kho Đông Đô"}],"diemtrahang":[{"_id":"5ad988e7133710622cbe809f","name":"Tri Phương 1 , huyện Tiên Du, tỉnh Bắc Ninh,","code":"cucmpr4f","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"search":"tri phuong 1 huyen tien du tinh bac ninh cucmpr4f","__v":0,"label":"Tri Phương 1 , huyện Tiên Du, tỉnh Bắc Ninh,"},{"_id":"5b0924e66324207584a3d4e4","name":"ST – Cty CP TGDĐ-Mini - Trí Quả - Bắc Ninh","code":"dnjt60zi","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"search":"st cty cp tgdd-mini - tri qua - bac ninh dnjt60zi","__v":0,"label":"ST – Cty CP TGDĐ-Mini - Trí Quả - Bắc Ninh"},{"_id":"5aa936d694a6a6531880b574","name":"Vũ Ninh, tp Bấc Ninh","code":"vxq4cm51","tinh":{"code":"01","name_with_type":"Thành phố Hà Nội","type":"thanh-pho","slug":"ha-noi","name":"Hà Nội"},"search":"vu ninh tp bac ninh vxq4cm51","__v":0,"label":"Vũ Ninh, tp Bấc Ninh"}],"diembatdau":0,"diemxanhat":0,"trongtai":2.5}*/}
                      {/*)*/}
                        {/*.then(res => {*/}
                          {/*console.log(res)*/}
                          {/*agent.DieuHanh.chonlaixe(*/}
                            {/*{"_id": res._id, "xe":"29C-85832", "date":20180708,"time":"2018-07-08T00:43:01.539Z","laixe": laixe}*/}
                          {/*)*/}
                        {/*})*/}
                        {/*.catch(err => {*/}
                          {/*// message.error("Thêm mới that bai")*/}
                        {/*})*/}
                    {/*}*/}
                  {/*}}*/}
          {/*>Demo 1 lái xe</Button>*/}
        {/*</span>*/}

        {!editOk && <span style={{marginRight: 5}}>
          <Button className="newDO" type="danger" >Hết hạn</Button>
        </span>}

        <div>
          <div style={{float: 'right'}}>
            <DatePicker format="DD-MM-YYYY"
                    onChange={this.changeDate}
                    value={moment(this.state.date, 'YYYYMMDD')}
            />
          </div>
          <div style={{clear: 'both'}}/>
        </div>
        <hr
          style={{margin: 10}}
        />

        <Tabs
          defaultActiveKey="1"
          tabPosition={"top"}
        >
          <TabPane tab={(<span>Lệnh chờ (<b style={{color: lenhcho.length > 0 ? 'red': ''}}>{lenhcho.length}</b>)</span>)} key="1">
            {lenhcho.map((el, index) => {
              return (
                <div key={index}
                  className="shadow"
                  style={{borderRadius: 3, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 14, padding: 5, cursor: 'pointer'}}
                >
                  <Row>
                    <Col span={12}>
                      {el.thauphu === 101 ? (<b style={{color: "blue" }}>COLOMBUS {el.laixe === null || el.laixe < 0 ? "(Chưa phân công)": (<b style={{color: 'red'}}> ( {this.state.laixeOBJ[el.laixe].ten} - {el.xe} )</b>)}</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}> {this.state.thauphuOBJ[el.thauphu].ten} ( xe: <span style={{color: 'red'}}>{el.xe}</span>)</b></span>)}
                      <br/>
                      Mã DO: <b style={{color: 'red'}}>{el._id}</b>
                      <br/>
                      Tên khách hàng: <b style={{color: 'red'}}>{this.state.khachhangObj[el.khachhang].value}</b>
                      <br/>
                      Tạo lúc: <b style={{color: 'red'}}>{moment(el.createAt).format("HH:mm ngày DD/MM/YYYY")}</b>
                      <br/>
                      Ngày: <b style={{color: 'red'}}>{moment(el.date, 'YYYYMMDD').format("DD/MM/YYYY")}</b>
                      <br/>
                      Điểm xuất phát: <b style={{color: 'red'}}>{el.diemxuatphat.length}</b> điểm
                      <div style={{padding: 5}}>
                        {el.diemxuatphat.map((p, index) => {
                          // console.log(p)
                          return (
                            <div key={index} style={{color: el.diembatdau === index ? "red": "black", fontSize: 12}}><b>+ {p.name} {el.diembatdau === index ? "(*)": ""}</b></div>
                          )
                        })}
                      </div>
                      Trọng tải: <b style={{color: 'red'}}>{el.trongtai}</b> Tấn
                      <br/>
                      Trọng tải thực: <b style={{color: 'red'}}>{el.trongtaithuc}</b> Kg
                      <br/>
                      CBM: <b style={{color: 'red'}}>{el.cbm}</b> Khối
                      <br/>
                      <div>
                        Ghi chú: <pre style={{background: 'rgba(100, 100, 100, 0.05)'}}>{el.ghichu}</pre>
                      </div>
                    </Col>

                    <Col span={12}>
                      Điểm trả hàng: <b style={{color: 'red'}}> {el.diemtrahang.length}</b> điểm
                        {el.diemtrahang.map((diemtra, index2) => {
                          return <div key={index2} style={{paddingLeft: 20, fontSize: 12, color: el.diemxanhat === index2 ? "red":"black" }}><b>[{index2 + 1}] {diemtra.name} {el.diemxanhat === index2 ? "(*)":"" }</b></div>
                        })}
                    </Col>

                  </Row>
                  <Row>
                    {(el.nguoitaolenh === this.props.user.ma || this.props.user.ma === 1052) && <div>

                      <Button type="primary"
                              onClick={() => this.chonLaiXe(el)}
                      >Chọn lái xe</Button>

                      <span style={{margin: '0 5px'}}>|</span>

                      <Popconfirm title="Xác nhận?" onConfirm={() => {
                        agent.DieuHanh.xoaLenh(el._id)
                          .then(res => {
                            message.success("Thành công")
                            this.init(this.state.date, this.state.date2)
                          })
                          .catch(err => {
                            message.error("That bai")
                          })
                      }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                        <Button type="danger">Xóa lệnh</Button>
                      </Popconfirm>

                    </div>}
                  </Row>
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={(<span>Chưa nhận (<b style={{color: chuanhan.length > 0 ? 'red': ''}}>{chuanhan.length}</b>)</span>)} key="2">
            {chuanhan.map((el, index) => {
              return (
                <div key={index}
                  style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 14, padding: 5, cursor: 'pointer'}}
                >
                  <Row>
                    <Col span={12}>
                      {el.thauphu === 101 ? (<b style={{color: "blue" }}>COLOMBUS {el.laixe === null || el.laixe < 0 ? "(Chưa phân công)": (<b style={{color: 'red'}}> ( {this.state.laixeOBJ[el.laixe].ten} - {el.xe} )</b>)}</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}> {this.state.thauphuOBJ[el.thauphu].ten} ( xe: <span style={{color: 'red'}}>{el.xe}</span>)</b></span>)}
                      <br/>
                      Tên khách hàng: <b style={{color: 'red'}}>{this.state.khachhangObj[el.khachhang].value}</b>
                      <br/>
                      Mã DO: <b style={{color: 'red'}}>{el._id}</b>
                      <br/>
                      Tạo lúc: <b style={{color: 'red'}}>{moment(el.createAt).format("HH:mm ngày DD/MM/YYYY")}</b>
                      <br/>
                      Ngày: <b style={{color: 'red'}}>{moment(el.date, 'YYYYMMDD').format("DD/MM/YYYY")}</b>
                      <br/>
                      Điểm xuất phát: <b style={{color: 'red'}}>{el.diemxuatphat.length}</b> điểm
                      <div style={{padding: 5}}>
                        {el.diemxuatphat.map((p, index) => {
                          // console.log(p)
                          return (
                            <div key={index} style={{color: el.diembatdau === index ? "red": "black", fontSize: 12}}><b>+ {p.name} {el.diembatdau === index ? "(*)": ""}</b></div>
                          )
                        })}
                      </div>
                      Trọng tải: <b style={{color: 'red'}}>{el.trongtai}</b> Tấn
                      <br/>
                      Trọng tải thực: <b style={{color: 'red'}}>{el.trongtaithuc}</b> Kg
                      <br/>
                      CBM: <b style={{color: 'red'}}>{el.cbm}</b> Khối
                      <br/>
                      <div>
                        Ghi chú: <pre style={{background: 'rgba(100, 100, 100, 0.05)'}}>{el.ghichu}</pre>
                      </div>
                    </Col>
                    <Col span={12} >
                      Điểm trả hàng: <b style={{color: 'red'}}> {el.diemtrahang.length}</b> điểm
                      {el.diemtrahang.map((diemtra, index2) => {
                        return <div key={index2} style={{paddingLeft: 20, fontSize: 12, color: el.diemxanhat === index2 ? "red":"black"}}><b>[{index2 + 1}] {diemtra.name} {el.diemxanhat === index2 ? "(*)":"" }</b></div>
                      })}
                    </Col>
                  </Row>

                  {(el.nguoitaolenh === this.props.user.ma || this.props.user.ma === 1052) &&  <div>
                    <Popconfirm title="Xác nhận?" onConfirm={() => {
                      agent.DieuHanh.nhanLenhThay(el)
                      .then(res => {
                        message.success("Thành công")
                        // this.context.router.replace('/dieuhanh');
                        this.init(this.state.date, this.state.date2)
                      })
                      .catch(err => {
                        message.error("That bai")
                      })
                    }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                      <Button type="primary">Nhận lệnh</Button>
                    </Popconfirm>

                    <span style={{margin: '0 5px'}}>|</span>

                    {editOk && <Popconfirm title="Xác nhận?" onConfirm={() => {
                      agent.DieuHanh.huyLenhThay(el)
                      .then(res => {
                        message.success("Thành công")
                          // this.context.router.replace('/dieuhanh');
                        this.init(this.state.date, this.state.date2)
                      })
                      .catch(err => {
                        message.error("That bai")
                      })
                    }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                      <Button type="danger">Hủy lệnh</Button>
                    </Popconfirm>}

                    {editOk && <span style={{margin: '0 5px'}}>|</span>}

                    {editOk && <Button
                      onClick={() => this.chinhsua(el)}
                    >Chỉnh sửa</Button>}

                    {!editOk && <Button
                        onClick={() => this.chinhsua(el)}
                      >Chỉnh sửa (qh)</Button>}

                    {editOk && <span style={{margin: '0 5px'}}>|</span>}

                    {editOk && <Popconfirm title="Xác nhận?" onConfirm={() => {
                      agent.DieuHanh.xoaLenh(el._id)
                        .then(res => {
                          message.success("Thành công")
                          this.init(this.state.date, this.state.date2)
                        })
                        .catch(err => {
                          message.error("That bai")
                        })
                    }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                      <Button type="danger">Xóa lệnh</Button>
                    </Popconfirm>}

                  </div> }
                </div>
              )
            })}
          </TabPane>

          <TabPane tab={(<span>Đã nhận (<b style={{color: danhan.length > 0 ? 'red': ''}}>{danhan.length}</b>)</span>)} key="3">
            {danhan.map((el, index) => {
              return (
                <div key={index}
                  style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 14, padding: 5, cursor: 'pointer'}}
                >
                  <Row>
                    <Col span={12}>
                      {el.thauphu === 101 ? (<b style={{color: "blue" }}>COLOMBUS {el.laixe === null || el.laixe < 0 ? "(Chưa phân công)": (<b style={{color: 'red'}}> ( {this.state.laixeOBJ[el.laixe].ten} - {el.xe} )</b>)}</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}> {this.state.thauphuOBJ[el.thauphu].ten} ( xe: <span style={{color: 'red'}}>{el.xe}</span>)</b></span>)}
                      <br/>
                      Tên khách hàng: <b style={{color: 'red'}}>{this.state.khachhangObj[el.khachhang].value}</b>
                      <br/>
                      Mã DO: <b style={{color: 'red'}}>{el._id}</b>
                      <br/>
                      Tạo lúc: <b style={{color: 'red'}}>{moment(el.createAt).format("HH:mm ngày DD/MM/YYYY")}</b>
                      <br/>
                      Ngày: <b style={{color: 'red'}}>{moment(el.date, 'YYYYMMDD').format("DD/MM/YYYY")}</b>
                      <br/>
                      Điểm xuất phát: <b style={{color: 'red'}}>{el.diemxuatphat.length}</b> điểm
                      <div style={{padding: 5}}>
                        {el.diemxuatphat.map((p, index) => {
                          // console.log(p)
                          return (
                            <div key={index} style={{color: el.diembatdau === index ? "red": "black", fontSize: 12}}><b>+ {p.name} {el.diembatdau === index ? "(*)": ""}</b></div>
                          )
                        })}
                      </div>
                      Trọng tải: <b style={{color: 'red'}}>{el.trongtai}</b> Tấn
                      <br/>
                      Trọng tải thực: <b style={{color: 'red'}}>{el.trongtaithuc}</b> Kg
                      <br/>
                      CBM: <b style={{color: 'red'}}>{el.cbm}</b> Khối
                      <br/>
                      <div>
                        Ghi chú: <pre style={{background: 'rgba(100, 100, 100, 0.05)'}}>{el.ghichu}</pre>
                      </div>
                    </Col>
                    <Col span={12} >
                      Điểm trả hàng: <b style={{color: 'red'}}> {el.diemtrahang.length}</b> điểm
                      {el.diemtrahang.map((diemtra, index2) => {
                        return <div key={index2} style={{paddingLeft: 20, fontSize: 12, color: el.diemxanhat === index2 ? "red":"black"}}><b>[{index2 + 1}] {diemtra.name} {el.diemxanhat === index2 ? "(*)":"" }</b></div>
                      })}
                    </Col>
                  </Row>
                  <Row>
                    {(el.nguoitaolenh === this.props.user.ma || this.props.user.ma === 1052) && <div>
                      <Popconfirm title="Xác nhận?" onConfirm={() => {
                        agent.DieuHanh.daGiaoHang(el)
                          .then(res => {
                            message.success("Thành công")
                            // this.context.router.replace('/dieuhanh');
                            this.init(this.state.date, this.state.date2)
                          })
                          .catch(err => {
                            message.error("That bai")
                          })
                      }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                        <Button type="primary">Đã giao hàng</Button>
                      </Popconfirm>

                      <span style={{margin: '0 5px'}}>|</span>
                      <Popconfirm title="Xác nhận?" onConfirm={() => {
                        agent.DieuHanh.huyChuyen(el)
                          .then(res => {
                            message.success("Thành công")
                            // this.context.router.replace('/dieuhanh');
                            this.init(this.state.date, this.state.date2)
                          })
                          .catch(err => {
                            message.error("That bai")
                          })
                      }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                        <Button type="danger">Điều rỗng</Button>
                      </Popconfirm>

                      {editOk && <span style={{margin: '0 5px'}}>|</span>}

                      {editOk && <Popconfirm title="Xác nhận?" onConfirm={() => {
                        agent.DieuHanh.xoaLenh(el._id)
                          .then(res => {
                            message.success("Thành công")
                            this.init(this.state.date, this.state.date2)
                          })
                          .catch(err => {
                            message.error("That bai")
                          })
                      }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                        <Button type="danger">Xóa lệnh</Button>
                      </Popconfirm>}



                      {!el.quaydau && el.lenhtruoc === 0 && <span style={{margin: '0 5px'}}>|</span>}
                      {!el.quaydau && el.lenhtruoc === 0 && <Button type="danger"
                                                                    onClick={() => this.lenhquaydau(el)}
                      >Tạo lệnh quay đầu</Button>}

                      <span style={{margin: '0 5px'}}>|</span>
                      <Popconfirm title="Xác nhận?" onConfirm={() => {
                        agent.DieuHanh.huyChuyen2(el)
                          .then(res => {
                            message.success("Thành công")
                            // this.context.router.replace('/dieuhanh');
                            this.init(this.state.date, this.state.date2)
                          })
                          .catch(err => {
                            message.error("That bai")
                          })
                      }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                        <Button type="ghost">Hủy chuyến</Button>
                      </Popconfirm>

                      <span style={{margin: '0 5px'}}>|</span>

                      {editOk && <div>
                        <Button
                          onClick={() => this.chinhsua(el)}
                        >Chỉnh sửa</Button>
                        <span style={{margin: '0 5px'}}>|</span>
                        <Popconfirm title="Xác nhận?" onConfirm={() => {
                          agent.DieuHanh.xoaLenh(el._id)
                            .then(res => {
                              message.success("Thành công")
                              this.init(this.state.date, this.state.date2)
                            })
                            .catch(err => {
                              message.error("That bai")
                            })
                        }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                          <Button type="danger">Xóa lệnh</Button>
                        </Popconfirm>

                      </div> }

                      {!editOk && <div>
                        <Button
                          onClick={() => this.chinhsua(el)}
                        >Chỉnh sửa (qh)</Button>
                      </div> }
                    </div>}
                  </Row>
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={(<span>Hoàn thành (<b style={{color: hoanthanh.length > 0 ? 'red': ''}}>{hoanthanh.length}</b>)</span>)} key="4">
            {hoanthanh.map((el, index) => {
              return (
                <div key={index}
                  style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 14, padding: 5, cursor: 'pointer', background: el.tinhtrang === 5 ? 'rgba(100, 100, 100, 0.3)': '' }}
                >
                  <Row>
                    <Col span={12}>
                      {el.thauphu === 101 ? (<b style={{color: "blue" }}>COLOMBUS {el.laixe === null || el.laixe < 0 ? "(Chưa phân công)": (<b style={{color: 'red'}}> ( {this.state.laixeOBJ[el.laixe].ten} - {el.xe} )</b>)}</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}> {this.state.thauphuOBJ[el.thauphu].ten} ( xe: <span style={{color: 'red'}}>{el.xe}</span>)</b></span>)}
                      <br/>
                      Tên khách hàng: <b style={{color: 'red'}}>{this.state.khachhangObj[el.khachhang].value}</b>
                      <br/>
                      Mã DO: <b style={{color: 'red'}}>{el._id}</b>
                      <br/>
                      Tạo lúc: <b style={{color: 'red'}}>{moment(el.createAt).format("HH:mm ngày DD/MM/YYYY")}</b>
                      <br/>
                      Ngày: <b style={{color: 'red'}}>{moment(el.date, 'YYYYMMDD').format("DD/MM/YYYY")}</b>
                      <br/>
                      Điểm xuất phát: <b style={{color: 'red'}}>{el.diemxuatphat.length}</b> điểm
                      <div style={{padding: 5}}>
                        {el.diemxuatphat.map((p, index) => {
                          // console.log(p)
                          return (
                            <div key={index} style={{color: el.diembatdau === index ? "red": "black", fontSize: 12}}><b>+ {p.name} {el.diembatdau === index ? "(*)": ""}</b></div>
                          )
                        })}
                      </div>
                      Trọng tải: <b style={{color: 'red'}}>{el.trongtai}</b> Tấn
                      <br/>
                      Trọng tải thực: <b style={{color: 'red'}}>{el.trongtaithuc}</b> Kg
                      <br/>
                      CBM: <b style={{color: 'red'}}>{el.cbm}</b> Khối
                      <br/>
                      <div>
                        Ghi chú: <pre style={{background: 'rgba(100, 100, 100, 0.05)'}}>{el.ghichu}</pre>
                      </div>
                    </Col>
                    <Col span={12} >
                      Điểm trả hàng: <b style={{color: 'red'}}> {el.diemtrahang.length}</b> điểm
                      {el.diemtrahang.map((diemtra, index2) => {
                        return <div key={index2} style={{paddingLeft: 20, fontSize: 12, color: el.diemxanhat === index2 ? "red":"black"}}><b>[{index2 + 1}] {diemtra.name} {el.diemxanhat === index2 ? "(*)":"" }</b></div>
                      })}
                    </Col>
                  </Row>
                  {(el.nguoitaolenh === this.props.user.ma || this.props.user.ma === 1052) && <div>
                  {editOk && <span>
                    <Button
                      onClick={() => this.chinhsua(el)}
                    >Chỉnh sửa</Button>
                    <span style={{margin: '0 5px'}}>|</span>
                    <Popconfirm title="Xác nhận?" onConfirm={() => {
                      agent.DieuHanh.xoaLenh(el._id)
                        .then(res => {
                          message.success("Thành công")
                          this.init(this.state.date, this.state.date2)
                        })
                        .catch(err => {
                          message.error("That bai")
                        })
                    }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                      <Button type="danger">Xóa lệnh</Button>
                    </Popconfirm>
                    </span>
                  }

                    <span style={{margin: '0 5px'}}>|</span>
                    {!editOk &&
                      <Button
                        onClick={() => this.chinhsua(el)}
                      >Chỉnh sửa (quá hạn)</Button>}

                    {!el.quaydau && el.lenhtruoc === 0 && <Button type="danger"
                                                                  onClick={() => this.lenhquaydau(el)}
                    >Tạo lệnh quay đầu</Button>}
                  </div>}
                </div>
              )
            })}
          </TabPane>

          <TabPane tab={(<span>Điều rỗng (<b style={{color: dieurong.length > 0 ? 'red': ''}}>{dieurong.length}</b>)</span>)} key="5">
            {dieurong.map((el, index) => {
              return (
                <div key={index}
                  style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 14, padding: 5, cursor: 'pointer'}}
                >
                  <Row>
                    <Col span={12}>
                      {el.thauphu === 101 ? (<b style={{color: "blue" }}>COLOMBUS {el.laixe === null || el.laixe < 0 ? "(Chưa phân công)": (<b style={{color: 'red'}}> ( {this.state.laixeOBJ[el.laixe].ten} - {el.xe} )</b>)}</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}> {this.state.thauphuOBJ[el.thauphu].ten} ( xe: <span style={{color: 'red'}}>{el.xe}</span>)</b></span>)}
                      <br/>
                      Mã DO: <b style={{color: 'red'}}>{el._id}</b>
                      <br/>
                      Tên khách hàng: <b style={{color: 'red'}}>{this.state.khachhangObj[el.khachhang].value}</b>
                      <br/>
                      Tạo lúc: <b style={{color: 'red'}}>{moment(el.createAt).format("HH:mm ngày DD/MM/YYYY")}</b>
                      <br/>
                      Ngày: <b style={{color: 'red'}}>{moment(el.date, 'YYYYMMDD').format("DD/MM/YYYY")}</b>
                      <br/>
                      Điểm xuất phát: <b style={{color: 'red'}}>{el.diemxuatphat.length}</b> điểm
                      <div style={{padding: 5}}>
                        {el.diemxuatphat.map((p, index) => {
                          // console.log(p)
                          return (
                            <div key={index} style={{color: el.diembatdau === index ? "red": "black", fontSize: 12}}><b>+ {p.name} {el.diembatdau === index ? "(*)": ""}</b></div>
                          )
                        })}
                      </div>
                      Trọng tải: <b style={{color: 'red'}}>{el.trongtai}</b> Tấn
                      <br/>
                      Trọng tải thực: <b style={{color: 'red'}}>{el.trongtaithuc}</b> Kg
                      <br/>
                      CBM: <b style={{color: 'red'}}>{el.cbm}</b> Khối
                      <br/>
                      <div>
                        Ghi chú: <pre style={{background: 'rgba(100, 100, 100, 0.05)'}}>{el.ghichu}</pre>
                      </div>
                    </Col>
                    <Col span={12} >
                      Điểm trả hàng: <b style={{color: 'red'}}> {el.diemtrahang.length}</b> điểm
                      {el.diemtrahang.map((diemtra, index2) => {
                        return <div key={index2} style={{paddingLeft: 20, fontSize: 12, color: el.diemxanhat === index2 ? "red":"black"}}><b>[{index2 + 1}] {diemtra.name} {el.diemxanhat === index2 ? "(*)":"" }</b></div>
                      })}
                    </Col>
                  </Row>
                  {(el.nguoitaolenh === this.props.user.ma || this.props.user.ma === 1052) && <div>
                    {editOk && <div>
                      <Button
                        onClick={() => this.chinhsua(el)}
                      >Chỉnh sửa</Button>
                      <span style={{margin: '0 5px'}}>|</span>
                      <Popconfirm title="Xác nhận?" onConfirm={() => {
                        agent.DieuHanh.xoaLenh(el._id)
                          .then(res => {
                            message.success("Thành công")
                            this.init(this.state.date, this.state.date2)
                          })
                          .catch(err => {
                            message.error("That bai")
                          })
                      }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                        <Button type="danger">Xóa lệnh</Button>
                      </Popconfirm>

                    </div>}

                    {!editOk &&
                    <Button
                      onClick={() => this.chinhsua(el)}
                    >Chỉnh sửa (quá hạn)</Button>}

                  </div>}
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={(<span>Đã hủy (<b style={{color: huy.length > 0 ? 'red': ''}}>{huy.length}</b>)</span>)} key="6">
            {huy.map((el, index) => {
              return (
                <div key={index}
                  style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 14, padding: 5, cursor: 'pointer'}}
                >

                  <Row>
                    <Col span={12}>
                      {el.thauphu === 101 ? (<b style={{color: "blue" }}>COLOMBUS {el.laixe === null || el.laixe < 0 ? "(Chưa phân công)": (<b style={{color: 'red'}}> ( {this.state.laixeOBJ[el.laixe].ten} - {el.xe} )</b>)}</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}> {this.state.thauphuOBJ[el.thauphu].ten} ( xe: <span style={{color: 'red'}}>{el.xe}</span>)</b></span>)}
                      <br/>
                      Mã DO: <b style={{color: 'red'}}>{el._id}</b>
                      <br/>
                      Tên khách hàng: <b style={{color: 'red'}}>{this.state.khachhangObj[el.khachhang].value}</b>
                      <br/>
                      Tạo lúc: <b style={{color: 'red'}}>{moment(el.createAt).format("HH:mm ngày DD/MM/YYYY")}</b>
                      <br/>
                      Ngày: <b style={{color: 'red'}}>{moment(el.date, 'YYYYMMDD').format("DD/MM/YYYY")}</b>
                      <br/>
                      Điểm xuất phát: <b style={{color: 'red'}}>{el.diemxuatphat.length}</b> điểm
                      <div style={{padding: 5}}>
                        {el.diemxuatphat.map((p, index) => {
                          // console.log(p)
                          return (
                            <div key={index} style={{color: el.diembatdau === index ? "red": "black", fontSize: 12}}><b>+ {p.name} {el.diembatdau === index ? "(*)": ""}</b></div>
                          )
                        })}
                      </div>
                      Trọng tải: <b style={{color: 'red'}}>{el.trongtai}</b> Tấn
                      <br/>
                      Trọng tải thực: <b style={{color: 'red'}}>{el.trongtaithuc}</b> Kg
                      <br/>
                      CBM: <b style={{color: 'red'}}>{el.cbm}</b> Khối
                      <br/>
                      <div>
                        Ghi chú: <pre style={{background: 'rgba(100, 100, 100, 0.05)'}}>{el.ghichu}</pre>
                      </div>
                    </Col>
                    <Col span={12} >
                      Điểm trả hàng: <b style={{color: 'red'}}> {el.diemtrahang.length}</b> điểm
                      {el.diemtrahang.map((diemtra, index2) => {
                        return <div key={index2} style={{paddingLeft: 20, fontSize: 12, color: el.diemxanhat === index2 ? "red":"black"}}><b>[{index2 + 1}] {diemtra.name} {el.diemxanhat === index2 ? "(*)":"" }</b></div>
                      })}
                    </Col>
                  </Row>

                  {editOk && <div>
                    <Button
                      onClick={() => this.chinhsua(el)}
                    >Chỉnh sửa</Button>
                    <span style={{margin: '0 5px'}}>|</span>

                    <Popconfirm title="Xác nhận?" onConfirm={() => {
                      agent.DieuHanh.xoaLenh(el._id)
                        .then(res => {
                          message.success("Thành công")
                          this.init(this.state.date, this.state.date2)
                        })
                        .catch(err => {
                          message.error("That bai")
                        })
                    }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                      <Button type="danger">Xóa lệnh</Button>
                    </Popconfirm>
                  </div> }
                </div>
              )
            })}
          </TabPane>

        </Tabs>

        <Modal
          width="1000"
          className={this.state.quaydau && "chuyenquaydau"}
          title={"Lệnh điều xe " + (this.state.quaydau ? "quay đầu" : "mới")}
          visible={this.state.visible}
          maskClosable={false}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="."
          cancelText="."
        >
          {this.state.visible && this.state.tinhtrang === -1 &&
          <DO quaydau={this.state.quaydau}
              danhsachxe={this.state.danhsachxe}
              danhsachlaixe={this.state.danhsachlaixe}
              success={() => {
                this.hideModal()
                this.init(this.state.date, this.state.date2)
              }}
              thauphu={this.state.thauphu}
              danhsachthauphu={this.state.danhsachthauphu}
              // date={this.state.date}
              tinhtrang={this.state.tinhtrang}
              DOTruoc={this.state.DOTruoc}
              edit={this.state.edit}
              date={this.state.date}
          />}

          {this.state.visible && this.state.tinhtrang >= 0 &&
          <DO danhsachxe={this.state.danhsachxe}
              danhsachlaixe={this.state.danhsachlaixe}
              danhsachthauphu={this.state.danhsachthauphu}
              success={() => {
                this.hideModal()
                this.init(this.state.date, this.state.date2)
              }}
              data={this.state.data}
              tinhtrang={this.state.tinhtrang}
              edit={this.state.edit}
              date={this.state.date}
          />}

        </Modal>
      </div>
    )
  }

  showModal1 = () => {
    this.setState({
      visible: true,
      quaydau: false,
      thauphu: false,
      tinhtrang: -1,
      action: 'them',
      edit: false
    });
  }

  lenhquaydau = (el) => {
    this.setState({
      visible: true,
      quaydau: true,
      thauphu: el.thauphu !== 101,
      tinhtrang: -1,
      DOTruoc: el,
      edit: false
    });
  }

  thauphu = () => {
    this.setState({
      visible: true,
      quaydau: false,
      thauphu: true,
      tinhtrang: -1,
      action: 'them',
      edit: false
    });
  }

  thauphuquaydau = () => {
    this.setState({
      visible: true,
      quaydau: true,
      thauphu: true,
      tinhtrang: -1,
      action: 'them',
      edit: false
    });
  }

  chonLaiXe = (data) => {
    this.setState({
      visible: true,
      data: data,
      tinhtrang: 0,
      edit: false
    });
  }

  chinhsua = (data) => {
    // console.log(data)
    this.setState({
      visible: true,
      // quaydau: true,
      // thauphu: true,
      tinhtrang: 6,
      data: data,
      edit: true
    });
  }
  xoa = (data) => {
    let that = this;
    agent.DieuHanh.xoaLenh(data._id)
      .then(res => {
        that.init(that.state.date, that.state.date2)
      })
  }

  hideModal = () => {
    this.setState({
      visible: false,
      data: null
    });
  }

}

Home.contextTypes = {
  router: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
