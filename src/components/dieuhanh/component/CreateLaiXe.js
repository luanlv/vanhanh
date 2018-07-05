import React from 'react'
import { Modal, Button, Input, Select } from 'antd';
import Tinh from './Tinh'
import {bindAll} from 'lodash'
import agent from '../../../agent'
import tinhObj from '../../tinhObj.json'

class CreateLaiXe extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,

    }
    bindAll(this, 'changeValue')
  }
  
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    let that = this;
    if(this.state.value && this.state.value.length > 0 ){
      agent.DieuHanh.dhThemLaiXe(
        {
          value: this.state.value,
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
  
  changeCode(e){
    this.setState({code: e.target.value})
  }
  
  changeValue(e){
    this.setState({value: e.target.value})
  }

  render() {
    return (
      <div>
        <Button type="primary" style={{float: 'right'}} onClick={this.showModal}>Thêm mới</Button>
        <Modal
          title="Thêm Lái Xe mới"
          okText="Thêm mới"
          cancelText="Hủy"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <br/>
          Tên Lái Xe:
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

export default CreateLaiXe