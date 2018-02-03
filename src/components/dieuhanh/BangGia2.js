import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import moment from 'moment'
import { connect } from 'react-redux';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import Avatar from '../_components/Avatar'

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
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
      DOs: [],
      phongban: []
    }
  }

  render() {
    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <h2 style={{textAlign: 'center'}}>Bảng giá khách hàng</h2>
        <div>
          <Tabs onChange={() => {}} type="card">
            <TabPane tab="Đông đô" key="1">
              <a href="/banggia/dongdo.xlsx"><Button>tải excel</Button></a>
              <hr/>
              <img src="/banggia/dongdo1.png" style={{width: '100%'}}/>
              <hr/>
              <img src="/banggia/dongdo2.png" style={{width: '100%'}}/>
              <hr/>
              <img src="/banggia/dongdo3.png" style={{width: '100%'}}/>
              <hr/>
            </TabPane>
            <TabPane tab="Maikateck" key="2">
              <a href="/banggia/Maikateck.xls"><Button>tải excel</Button></a>
              <hr/>
              <img src="/banggia/me1.png" style={{width: '100%'}}/>
              <hr/>
              <img src="/banggia/me2.png" style={{width: '100%'}}/>
              <hr/>
            </TabPane>
            <TabPane tab="Sunhouse" key="3">
              <a href="/banggia/sunhouse.xlsx"><Button>tải excel</Button></a>
              <hr/>
              <img src="/banggia/sun1.png" style={{width: '100%'}}/>
              <img src="/banggia/sun2.png" style={{width: '100%'}}/>
              <hr/>
            </TabPane>
            <TabPane tab="Thuận phát" key="4">4</TabPane>
            <TabPane tab="Media" key="5">5</TabPane>
            <TabPane tab="INAX" key="6">6</TabPane>
            <TabPane tab="Thuốc lá" key="7">7</TabPane>
            <TabPane tab="Grekit" key="8">8</TabPane>
            <TabPane tab="APE" key="9">9</TabPane>
            <TabPane tab="Konet" key="10">10</TabPane>
          </Tabs>
        </div>
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
