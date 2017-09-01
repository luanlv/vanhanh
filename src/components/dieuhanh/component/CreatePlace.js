import React from 'react'
import { Modal, Button, Input, Select } from 'antd';
import Tinh from './Tinh'
import {bindAll} from 'lodash'
import agent from '../../../agent'
import tinhObj from '../../tinhObj.json'

class CreatePlace extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      tinh: "01"
    }
    bindAll(this, 'changeTinh', 'changeMaDiem', 'changeTenDiem')
  }
  
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    let that = this;
    if(this.state.ten && this.state.ten.length > 0 && this.state.ma && this.state.ma.length > 0 && this.state.tinh && this.state.tinh.length > 0){
      agent.DieuHanh.themDiaDiem(
        {
          name: this.state.ten,
          code: this.state.ma,
          tinh: tinhObj[this.state.tinh]
        }
      ).then(res => {
        if(that.props.newOK){
           that.props.newOK(res)
        }
        this.setState({
          visible: false,
        });
      })
        .catch(err => {
          alert('co loi!')
        })
    }
    
  }
  
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  
  changeMaDiem(e){
    this.setState({ma: e.target.value})
  }
  
  changeTenDiem(e){
    this.setState({ten: e.target.value})
  }
  
  changeTinh (value) {
    // console.log(value)
    this.setState({tinh: value})
  }
  render() {
    return (
      <div>
        <Button type="primary" style={{float: 'right'}} onClick={this.showModal}>Thêm địa điểm mới</Button>
        <Modal
          title="Thêm địa điểm mới"
          okText="Thêm mới"
          cancelText="Hủy"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          Mã điểm:
          <Input
            onChange={this.changeMaDiem}
          />
          <br/>
          Tên điểm:
          <Input
            onChange={this.changeTenDiem}
          />
          <br/>
          Tỉnh:
          <Tinh
            handleChange={this.changeTinh}
          />
        </Modal>
      </div>
    );
  }
}

export default CreatePlace