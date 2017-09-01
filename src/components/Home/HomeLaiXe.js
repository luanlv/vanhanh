import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

import {Button, Row} from 'antd'


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
      <div className="home-page">
        <Row className="homeWr">
          <Button
            className="mt20"
            style={{width: '100%'}}
            type="dashed">Khai bao DO</Button>

          <Button
            className="mt20"
            style={{width: '100%'}}
            type="dashed">Danh sach DO</Button>

          <Button
            className="mt20"
            style={{width: '100%'}}
            type="dashed">Khai bao phu phi</Button>

          <Button
            className="mt20"
            style={{width: '100%'}}
            type="dashed">Danh sach phu phi</Button>

        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
