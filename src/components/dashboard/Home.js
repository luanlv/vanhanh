import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import moment from 'moment'
import { connect } from 'react-redux';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

// const data = [
//   {name: '11/10/17', CLB: 10, TP: 5 },
//   {name: '12/10/17', CLB: 2, TP: 5},
//   {name: '13/10/17', CLB: 3, TP: 1},
//   {name: '15/10/17', CLB: 1, TP: 5},
//   {name: '14/10/17', CLB: 5, TP: 2},
//   {name: '16/10/17', CLB: 5, TP: 2},
//   {name: '17/10/17', CLB: 5, TP: 4},
// ];

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import Avatar from '../_components/Avatar'

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio} from 'antd';

const Promise = global.Promise;

class StackedBarChart extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      DOs: []
    }
  }

  componentWillMount = async () => {
    let DO5days = await agent.DieuHanh.getDOs5Day()
    this.setState({
      DOs: DO5days
    })
  }

  render () {
    let dataObj = []
    this.state.DOs.forEach(lenh => {
      if(!dataObj[lenh.date]){
        dataObj[lenh.date] = {date: lenh.date, name: moment(lenh.date, 'YYYYMMDD').format('DD/MM/YY'), CLB: 0, TP: 0}
        if(lenh.thauphu === 101){
          dataObj[lenh.date].CLB = dataObj[lenh.date].CLB + 1
        } else {
          dataObj[lenh.date].TP = dataObj[lenh.date].TP + 1
        }
      } else {
        if(lenh.thauphu === 101){
          dataObj[lenh.date].CLB = dataObj[lenh.date].CLB + 1
        } else {
          dataObj[lenh.date].TP = dataObj[lenh.date].TP + 1
        }
      }
    })
    let dataChart = []
    for(var key in dataObj) {
      dataChart.push(dataObj[key])
    }
    dataChart.sort((a,b) => {return a.date > b.date})
    console.log(dataChart)
    return (
      <BarChart width={1200} height={600} data={dataChart}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Bar dataKey="CLB" stackId="a" fill="#8884d8" />
        <Bar dataKey="TP" stackId="a" fill="#82ca9d" />
      </BarChart>
    );
  }
}



const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
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
      visible: false,
      data: {
        mien: 'bac'
      },
      DOs: [],
      phongban: []
    }
    // this.init()
  }

  // componentWillMount = async () => {
  //   let DO5days = await agent.DieuHanh.getDOs5Day()
  //   this.setState({
  //     DOs: DO5days
  //   })
  // }

  render() {
    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <h2 style={{textAlign: 'center'}}>Số chuyến chạy theo ngày</h2>
        <StackedBarChart/>
      </div>
    );
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
