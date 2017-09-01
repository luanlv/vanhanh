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
import {Form, Icon, Row, Col, Input, Button, message, Select, AutoComplete, InputNumber, Spin} from 'antd'
import PropTypes from 'prop-types';

import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import ThemAutoFillPeople  from './component/ThemAutoFillPeople'
import ThemAutoFillPlace  from './component/ThemAutoFillPlace'

import {slugify} from '../_function'

const Option = Select.Option;
const FormItem = Form.Item;
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

class DOPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      init: true,
      data: {},
    }
  }

  componentWillMount() {
  
  }

  render() {
    let gThis = this
    return (
      <div className="home-page" style={{marginTop: '1rem'}}>
        <div style={{padding: '0.3em'}}>
          
          {!this.state.init && (
            <div style={{textAlign: 'center', paddingTop: 50}}>
              <Spin tip="Loading..." />
            </div>
          )}
          {this.state.init && (
            <div className="it">
              <h2 style={{textAlign: 'center', fontSize: '1.2rem'}}>Thêm các trường tự động</h2>
              <ThemAutoFillPeople
                title="Khách hàng"
                fieldName="khachhang"
              />
              <ThemAutoFillPeople
                title="Người yêu cầu"
                fieldName="nguoiyeucau"
              />
              <ThemAutoFillPlace
                title="Đia điểm"
                fieldName="diadiem"
              />
              \
            </div>
          )}
          
        </div>
      </div>
    )
  }
}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DOPage);

