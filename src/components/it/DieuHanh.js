/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {Form, Icon, Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
import PropTypes from 'prop-types';

import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import ThemDieuHanhForm  from './component/ThemDieuHanhForm'

import {slugify} from '../_function'

const Promise = global.Promise;
const Option = Select.Option;
const FormItem = Form.Item;
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

class DOPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount() {

  }

  render() {
    let gThis = this
    return (
      <div className="do-page">
        <div className="laixe-doWr">
          <h2 className="mb20" style={{textAlign: 'center', paddingTop: 20}}>Them Dieu Hanh</h2>
          <ThemDieuHanhForm
            defaultValue={{}}
          />
        </div>
      </div>
    )
  }
}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DOPage);

