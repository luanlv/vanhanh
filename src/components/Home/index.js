import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

import {Button, Row} from 'antd'


const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.common,
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

  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    // if(this.props.currentUser.role === 'laixe')
    //   this.context.router.replace('/laixe')
    // if(this.props.currentUser.role === 'it')
    //   this.context.router.replace('/it')
    // if(this.props.currentUser.role === 'dieuhanh')
    //   this.context.router.replace('/dieuhanh')
    // if(this.props.currentUser.role === 'thauphu')
    //   this.context.router.replace('/thauphu')
    return (
      <div className="home-page">
        ...
      </div>
    );
  }
}

Home.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
