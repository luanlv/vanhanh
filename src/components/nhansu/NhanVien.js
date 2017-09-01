import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio} from 'antd';
import moment from 'moment'

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
});

class Home extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      data: {
        mien: 'bac'
      },
      nhanvien: [],
      phongban: []
    }
    this.init()
  }
  
  init = async () => {
    let that = this;
    const nhanvien = await agent.NhanSu.tatCaNhanVien()
    const phongban = await agent.NhanSu.tatCaPhongBan()
    this.setState({
      nhanvien: nhanvien,
      phongban: phongban
    })
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  
  handleSizeChange = (e) => {
    let value = e.target.value
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          mien: value
        }
      }
    })
    
  }
  
  themMoi = () => {
    let that = this;
  
    agent.NhanSu.themNhanVien(this.state.data)
      .then(res => {
        that.init()
      })
    
    this.setState({
      visible: false,
    });
  }
  
  handleChangeMultipleSelect = (value) => {
    let phongban = []
    value.map(el => {
      phongban.push(el)
    })
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          phongban: phongban
        }
      }
    })
  }
  
  render() {
    const phongban = this.state.phongban
    const children = [];
    this.state.phongban.map((el, index) => {
      children.push(<Option key={el.ma}>{el.ten} - {el.ma}</Option>);
    })
    return (
      <div className="home-page" style={{padding: 10, marginTop: 10}}>
        <Button type="primary" onClick={this.showModal}>Thêm mới</Button>
  
        <hr/>
        
        <Table dataSource={this.state.nhanvien}>
          <ColumnGroup title="Name">
            <Column
              title="Tên nhân viên"
              dataIndex="ten"
              key="ten"
            />
            <Column
              title="Mã nhân viên"
              key="ma"
              render={(text, record) => (
                <div style={{color: (record.ma >= 2000)?"red":"blue"}}>
                  {record.ma}
                </div>
                )}
            />
            <Column
              title="Phòng ban"
              key="phongban"
              render={(text, record) => (
                <span>
                {record.phongban.map((ma, index) => {
                  return <div key={index} style={{color: (ma >= 300)?"orange":((ma >= 200)?"red":"blue")}}>
                    + {findPhongban(ma, phongban).ten} - {ma}
                  </div>
                })}
              </span>
              )}
            />
          </ColumnGroup>
          {/*<Column*/}
            {/*title="Action"*/}
            {/*key="action"*/}
            {/*render={(text, record) => (*/}
              {/*<span>*/}
                {/*{record.ten}*/}
              {/*</span>*/}
            {/*)}*/}
          {/*/>*/}
        </Table>
        
        <Modal
          title="Thêm phòng/ban mới"
          visible={this.state.visible}
          onOk={this.themMoi}
          onCancel={this.hideModal}
          okText="Thêm mới"
          cancelText="Đóng"
        >
          <Input placeholder="Tên"
                 onChange={(e) => {
                   let value = e.target.value
                   this.setState(prev => {
                     return {
                       ...prev,
                       data: {
                         ...prev.data,
                         ten: value
                       }
                     }
                   })}}
          />
          
          <br/>
  
          <Radio.Group value={this.state.data.mien} onChange={this.handleSizeChange}>
            <Radio.Button value="bac">Miền bắc</Radio.Button>
            <Radio.Button value="nam">Miền nam</Radio.Button>
          </Radio.Group>
  
          <br/>
  
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Chọn phòng ban"
            onChange={this.handleChangeMultipleSelect}
          >
            {children}
          </Select>
  
          <br/>
          
        </Modal>
        
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

function findPhongban(ma, list){
  for(var i = 0; i< list.length; i++){
    if(list[i].ma === ma){
      return list[i]
    }
  }
  return {}
}