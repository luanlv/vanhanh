import React from 'react'
import { Modal, Button, Input, Select, InputNumber } from 'antd';
import Tinh from './Tinh'
import {bindAll} from 'lodash'
import agent from '../../../agent'
import tinhObj from '../../tinhObj.json'

class CreateKhachHang extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,

    }
    bindAll(this, 'changeCode', 'changeValue')
  }
  
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    let that = this;
    if(this.state.ten && this.state.ten.length > 0 && this.state.ma && this.state.ma > 0 ){
      agent.DieuHanh.themThauPhu(
        {
          ma: this.state.ma,
          ten: this.state.ten,
        }
      ).then(res => {
        if(that.props.handleOk){
           that.props.handleOk(res)
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
  
  changeCode(value){
    this.setState({ma: value})
  }
  
  changeValue(e){
    this.setState({ten: e.target.value})
  }

  render() {
    return (
      <div>
        <Button type="primary" style={{float: 'right'}} onClick={this.showModal}>Thêm mới</Button>
        <Modal
          title="Thêm thầu phụ mới"
          okText="Thêm mới"
          cancelText="Hủy"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          Mã Thầu Phụ:
          <br/>
          <InputNumber
            style={{width: '100%'}}
            onChange={this.changeCode}
          />
          <br/>
          Tên Thầu Phụ:
          <Input
            onChange={this.changeValue}
          />
          {/*<br/>*/}
          {/*Tỉnh:*/}
          {/*<Tinh*/}
            {/*handleChange={this.changeTinh}*/}
          {/*/>*/}
        </Modal>
      </div>
    );
  }
}

export default CreateKhachHang