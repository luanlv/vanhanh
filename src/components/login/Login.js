/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React  from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = { }
  }
  render() {
    return (
      <div>
        <div>
          <h1
            style={{marginBottom: 20, textAlign: 'center'}}
          >Đăng nhập</h1>
          <form action="/auth/login" method="GET" className="ant-form ant-form-horizontal login-form"><span className="ant-input-affix-wrapper"><span className="ant-input-prefix"><i className="anticon anticon-user" style={{fontSize: 13}} /></span><input type="text" id="username" name="username" placeholder="Tên đăng nhập" className="ant-input" /></span><br /><br /><span className="ant-input-affix-wrapper"><span className="ant-input-prefix"><i className="anticon anticon-lock" style={{fontSize: 13}} /></span><input type="password" id="password" name="password" placeholder="Mật khẩu" className="ant-input" /></span><br /><br /><button type="submit" className="ant-btn ant-btn-submit login-form-button"><span>Đăng nhập</span></button></form>
        </div>
      </div>
    )
  }

}

export default Login
