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

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio} from 'antd';
import moment from 'moment'
import ThuChi from './component/ThuChi'

const { Column, ColumnGroup } = Table;
const Option = Select.Option;

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),

  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })

})

class Home extends React.Component {

  constructor (props) {

    super(props)

    this.state = {
      visible: false,
      init: false,
      quy: []
    }

    this.init()
    bindAll(this, 'handleOK')
  }

  init = async () => {
    const quy = await agent.ThuQuy.init()
    this.setState({
      quy: quy,
      init: true
    })
  }

  handleOK (el) {
    let quy = this.state.quy;
    quy.unshift(el)
    this.setState({
      quy: quy
    })
  }


  render() {
    if(!this.state.init){
      return (
        <div>
          Loading ...
        </div>
      )
    }

    return (
      <div className="home-page" style={{padding: 10, marginTop: 10}}>
        <Row>
          <div
            style={{textAlign: 'center', fontSize: 48, color: 'red'}}
          >{this.state.quy[0].tienquy.toLocaleString()} đ</div>
        </Row>

        <ThuChi
          tienhientai={this.state.quy[0].tienquy}
          handleOK={this.handleOK}
        />

        <hr/>

        <Table dataSource={this.state.quy}>

          <ColumnGroup title="Tiền quỹ"
            style={{background: 'red'}}
          >

            <Column
              title="Ngày"
              key="ngay"
              render={(text, record) => (
                <span style={{color: 'red'}}>
                  {moment(record.createAt).format('DD/MM/YYYY HH:mm')}
                  </span>
              )}
            />

            <Column
              title="Đối tượng"
              key="doituong"
              render={(text, record) => (
                <span>
                  {record.nguoi}
                  </span>
              )}
            />

            <Column
              title="Thông tin thêm"
              key="lydo"
              render={(text, record) => (
                <span>
                  {record.lydo}
                  </span>
              )}
            />

            <Column
              title="Mã lệnh"
              key="malenh"
              render={(text, record) => (
                <span
                >
                  {record.loai === 'thanhtoan' && "Thanh Toán"}
                  {record.loai === 'ungtien' && "Ứng Tiền"}
                  {record.loai === 'hoanung' && "Hoàn Ứng"}
                  {record.loai === 'nhapquy' && "Nhập Quỹ"}
                  </span>
              )}
            />

            <Column
              title="Thu/Chi"
              key="thuchi"
              render={(text, record) => (
                <span>
                  {(record.loai === 'thanhtoan' || record.loai === 'ungtien') && "Chi"}
                  {(record.loai === 'hoanung' || record.loai === 'nhapquy') && "Thu"}
                  </span>
              )}
            />

            <Column
              title="Tiền"
              key="tien"
              render={(text, record) => (
                <span style={{color: (record.loai === 'thanhtoan' || record.loai === 'ungtien')?'red':'green'}}>
                  {(record.loai === 'thanhtoan' || record.loai === 'ungtien')?'-':"+"}
                  {record.tienthanhtoan.toLocaleString()}
                  </span>
              )}
            />

            <Column
              title="Tiền hiện tại"
              key="tienhientai"
              render={(text, record) => (
                <span style={{color: 'orange'}}>
                  {record.tienquy.toLocaleString()}
                  </span>
              )}
            />

            <Column
              title="Lưu quỹ"
              key="luuquy"
              render={(text, record) => (
                <span style={{color: 'orange'}}>
                  {record.luuquy && "Có"}
                  </span>
              )}
            />


          </ColumnGroup>
        </Table>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);