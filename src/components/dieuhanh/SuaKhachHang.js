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

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio, Tabs, Popconfirm, notification, List} from 'antd';
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

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];


class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      diachi: []
    }

    this.init()
  }

  componentDidMount(){

  }

  componentWillUnmount () {
  }


  componentWillMount = async () => {

  }


  init = async () => {
    let that = this;
    let diachi = await agent.DieuHanh.khachHang()
    this.setState({
      diachi: diachi
    })
  }

  render() {
    const role = this.props.user.role;

    return (
      <div className="home-page" style={{marginTop: 10, padding: 10}}>

        <List
          size="small"
          bordered
          dataSource={this.state.diachi}
          renderItem={(item, idx) => {

            return (<List.Item
              onClick={() => {
                this.setState({index: idx})
              }}
            >
              {this.state.index === idx && <div
                style={{width: '100%'}}
              >
                <Input
                  type="text"
                  style={{width: '50%'}}
                  value={this.state.diachi[this.state.index].value}
                  onChange={(e) => {
                  let diachi = this.state.diachi
                  diachi[this.state.index].value = e.target.value
                   this.setState({
                       diachi: diachi
                     })
                   }}
                />
                -
                <Button type="primary"
                  onClick={() => {
                    let that = this;
                    agent.DieuHanh.capnhapkhachhang(that.state.diachi[that.state.index])
                      .then(res => {
                        that.setState({index: -1})
                      })
                  }}
                >Cập nhập</Button>
              </div>}
              {this.state.index !== idx && <div> - <b>{item.value}</b></div>}

            </List.Item>)
          }
          }
        />
      </div>
    )
  }



}

function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


Home.contextTypes = {
  router: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
