import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import Avatar from '../_components/Avatar'

import {Button, Row} from 'antd'
import { Flex, WingBlank } from 'antd-mobile';


const Promise = global.Promise;

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
  componentWillMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed :
      agent.Articles.all;

    // this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise()]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <div style={{padding: '0.3em', maxWidth: '800px', margin: '0 auto'}}>
          
          <Link to="/dieuhanh/themdo">
            <Button size={"large"} className="btn" type="primary" style={{backgroundColor: 'grey !important' ,width: '100%', height: '3rem', fontSize: '1rem'}}>Thêm lệnh mới</Button>
          </Link>
          <Link to="/dieuhanh/dochuaphancong">
            <Button size={"large"} className="btn" type="primary" style={{width: '100%', marginTop: '0.3rem', height: '3rem', fontSize: '1rem'}}>Lệnh chưa phân công</Button>
          </Link>
          <Link to="/dieuhanh/dochuanhan">
            <Button size={"large"} className="btn" type="primary" style={{width: '100%', marginTop: '0.3rem', height: '3rem', fontSize: '1rem'}}>Lệnh LX chưa nhận</Button>
          </Link>
          <Link to="/dieuhanh/dodanhan">
            <Button size={"large"} className="btn" type="primary" style={{width: '100%', marginTop: '0.3rem', height: '3rem', fontSize: '1rem'}}>Lệnh LX đã nhận</Button>
          </Link>
          <Link to="/dieuhanh/danhsachdo">
            <Button size={"large"} className="btn" type="primary" style={{width: '100%', marginTop: '0.3rem', height: '3rem', fontSize: '1rem'}}>Danh sách</Button>
          </Link>
          
        </div>
      
        
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
