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
        <div style={{paddingLeft: 20, minHeight: 600}}>
            <div>
              <a href="/banggia/dongdo.xlsx"><Button>Tải bảng giá Đông Đô</Button></a>
              <br/>
              <a href="/banggia/sunhouse.xlsx"><Button>Tải bảng giá Sunhouse</Button></a>
              <br/>
              <a href="/banggia/Maikateck.xls"><Button>Tải bảng giá Maikateck</Button></a>
              <br/>
              <a href="/banggia/thuanphat.xls"><Button>Tải bảng giá Thuận Phát</Button></a>
              <br/>
              <a href="/banggia/media.xlsx"><Button>Tải bảng giá Media</Button></a>
              <br/>
              <a href="/banggia/inax.xlsx"><Button>Tải bảng giá INAX</Button></a>
              <br/>
              <a href="/banggia/grekit.xls"><Button>Tải bảng giá Grekit</Button></a>
              <br/>
              <a href="/banggia/ape.xls"><Button>Tải bảng giá APE</Button></a>
              <br/>
              <a href="/banggia/konet.xls"><Button>Tải bảng giá Konet</Button></a>
            </div>
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
