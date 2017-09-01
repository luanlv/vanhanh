import React from 'react'
import { Modal, Button, Switch, Input, Select, InputNumber, AutoComplete, message } from 'antd';
import {bindAll} from 'lodash'
import agent from '../../../agent'
import {slugify} from '../../_function'

const { TextArea } = Input;

class ThuChi extends React.Component {
  constructor(props){

    super(props)

    this.state = {
      visible: false,
      loai: props.edit ? props.data.loai : 'thanhtoan',
      tien: props.edit ? props.data.tien : 0,
      doituong: props.edit ? props.data.nguoi : '',
      lydo: props.edit ? props.data.lydo : '',
      luuquy: false,
      total: props.tienhientai,
      danhsachtennhanvien: []
    }

    bindAll(this, 'showModal', 'handleOk', 'handleCancel', 'changeLoai', 'changeTien', 'changeLyDo', 'changeDoiTuong', 'changeLuuQuy')
  }

  componentWillMount = async () => {
    const nhanvien = await agent.NhanSu.tatCaTenNhanVien()
    this.setState({danhsachtennhanvien: nhanvien})
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    let that = this;
    agent.ThuQuy.them({
      loai: this.state.loai,
      tien: this.state.tien,
      doituong: this.state.doituong,
      lydo: this.state.lydo,
      total: (this.state.loai === 'thanhtoan' || this.state.loai === 'ungtien')?(this.props.tienhientai - this.state.tien):(this.props.tienhientai + this.state.tien),
      luuquy: (this.state.loai === 'thanhtoan' || this.state.loai === 'ungtien')?(this.state.luuquy):(false)
    }).then(res => {
      message.success('Thành công!')
      this.setState({visible: false})
      this.props.handleOK(res)
    }).catch(err => {
      message.error('Có lỗi!')
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  changeLoai(value){
    this.setState({loai: value})
  }

  changeTien(value){
    this.setState({tien: value})
  }

  changeLyDo(e){
    this.setState({lydo: e.target.value})
  }

  changeDoiTuong(e){
    this.setState({doituong: e.target.value})
  }

  changeLuuQuy(value){
    this.setState({
      luuquy: value
    })
  }

  changeTinh (value) {
    this.setState({tinh: value})
  }
  render() {
    return (
      <div style={{textAlign: 'right'}}>
        <Button type="primary"
          onClick={this.showModal}
        >Thêm mới Thu/Chi</Button>
        {this.state.visible && <Modal
          title="Thêm mới thu / chi"
          okText="Đồng ý"
          cancelText="Hủy"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            Loại :
            <br/>
            <Select
              style={{width: '100%'}}
              value={this.state.loai}
              onChange={this.changeLoai}
              disabled={this.props.edit}
            >
              <Select.Option value="thanhtoan">Thanh Toán</Select.Option>
              <Select.Option value="ungtien">Ứng Tiền</Select.Option>
              <Select.Option value="hoanung">Hoàn Ứng</Select.Option>
              <Select.Option value="nhapquy">Nhập Quỹ</Select.Option>
            </Select>
            <br/>

            <br/>
            Số tiền:
            <br/>
            <InputNumber
              style={{width: '100%'}}
              site="large"
              defaultValue={this.state.tien}
              formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              parser={value => value.replace(/(,*)/g, '')}
              // value={this.state.tien}
              onChange={this.changeTien}
            />

            <br/>
            <br/>
            Đối tượng:
            {/*<Input*/}
              {/*value={this.state.doituong}*/}
              {/*onChange={this.changeDoiTuong}*/}
            {/*/>*/}

          <AutoComplete
            style={{width: '100%'}}
            dataSource={this.state.danhsachtennhanvien}
            value={this.state.doituong}
            onChange={(v) => {
              this.setState({doituong: v})
            }}
            filterOption={(inputValue, option) => slugify(option.props.children.toUpperCase()).indexOf(slugify(inputValue.toUpperCase())) !== -1}
            disabled={this.props.edit}
          />
          <br/>
          <br/>
          Lý do:
          <Input
            style={{width: '100%'}}
            value={this.state.lydo}
            onChange={this.changeLyDo}
          />
          <br/>
          {(this.state.loai === 'thanhtoan' || this.state.loai === 'ungtien') && <span>
            <br/>
            Lưu Quỹ: <Switch checked={this.state.luuquy}
            onChange={this.changeLuuQuy}
            disabled={this.props.edit}
          />
            <br/>
          </span>}
          <br/>
          <hr/>
          <h3 style={{textAlign: 'center', color: (this.state.loai === 'thanhtoan' || this.state.loai === 'ungtien') ? 'red': 'green'}}>
            {('' + this.props.tienhientai.toLocaleString())}
            {(this.state.loai === 'thanhtoan' || this.state.loai === 'ungtien')?' - ':' + '}
            {this.state.tien.toLocaleString() + ' = '}
            {(this.state.loai === 'thanhtoan' || this.state.loai === 'ungtien')?((this.props.tienhientai - this.state.tien).toLocaleString()):((this.props.tienhientai + this.state.tien).toLocaleString())}
          </h3>
          <br/>
        </Modal>}
      </div>
    );
  }
}

export default ThuChi