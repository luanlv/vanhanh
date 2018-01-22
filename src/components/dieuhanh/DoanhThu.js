import React from 'react';
import PropTypes from 'prop-types';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import Status from './component/Status'
import axios from 'axios'
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
      data: []
    }

    this.init()
  }

  componentDidMount(){

  }

  componentWillUnmount () {
  }


  componentWillMount = async () => {

  }


  init = async (page) => {

  }

  render() {

    return (
      <div className="home-page" style={{marginTop: 10, padding: 10}}>
        <form role="form" className="form" onSubmit="return false;">
          <div className="form-group">
            {/*<label for="file">File</label>*/}
            <input id="file" type="file" className="form-control"/>
          </div>

          <button id="upload" type="button" className="btn btn-primary"
            onClick={() => {
              let that = this
              var data = new FormData();
              data.append('foo', 'bar');
              data.append('file', document.getElementById('file').files[0]);
              var config = {
                onUploadProgress: function(progressEvent) {
                  var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                }
              };
              axios.post( `${agent.API_ROOT}/upload`, data)
                .then(function (res) {
                  if(res.data.error_code === 0) {
                    console.log(res.data.data)
                      that.setState({data: res.data.data})
                  } else {
                    console.log(res.data)
                    alert("Lỗi")
                  }
                })
                .catch(function (err) {
                  console.log(err)
                  alert("Có lỗi")
                });
            }}
          >Up excel</button>
        </form>
        {this.state.data.length > 0 && <button
          onClick={() => {
            let that = this;
            axios.post(`${agent.API_ROOT}/doanhthu`, that.state.data)
              .then(res => {
                alert('Nhập thành công')
              })
              .catch(err => {
                alert('Có lỗi')
              })
          }}
        >Cập nhập</button>}
        <hr/>

        {this.state.data && <div>
          <table style={{border: "1px solid black"}}>
            <thead style={{border: "1px solid black"}}>
              <tr>
                <th style={{borderRight: "1px solid black"}}>Mã lệnh</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody style={{border: "1px solid black"}}>
              {this.state.data.map((el, idx) => {
                console.log(el)
                return (
                  <tr key={idx}>
                    <td style={{borderRight: "1px solid black"}}>{el["mã lệnh"]}</td>
                    <td>{(el["doanh thu"] || 0).toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>}
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
