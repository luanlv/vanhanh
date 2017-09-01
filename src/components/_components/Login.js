import React from 'react'
import {Link} from 'react-router'
import { Tabs, Row, Col, Input, Icon, Button  } from 'antd';

import { List, InputItem, WhiteSpace, Picker, Radio, Flex,  SegmentedControl, WingBlank } from 'antd-mobile';
import { createForm } from 'rc-form';

import ListErrors from '../ListErrors';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../../constants/actionTypes';

const TabPane = Tabs.TabPane;
const RadioItem = Radio.RadioItem;

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (username, password, type) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(username, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
});



class Component extends React.Component {
  constructor(){
    super();
    this.state={
      selectedIndex: 0,
      type: 'dieuhanh',
      username: ' ',
      password: ' ',
    }

    this.submitForm = (username, password) => {
      let that = this;
      if(isNaN(username)){
        alert('Tài khoản là mã nhân viên')
      } else {
        this.props.onSubmit(username.trim(), password.trim());
      }
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
  
    const username = this.state.username;
    const password = this.state.password;
    return (
      <div className="auth-page">
        <div className="container page">
          <form action="" autoComplete="off">
            <div className="row">

            <div className="loginWr" style={{maxWidth: 800, margin: '0 auto', padding: 15}}>
              <div className="headerLogin">
              </div>
              <div style={{marginTop: 10}}>
                
                Tài khoản:
                <Input
    
                  value={this.state.username}
                  onFocus={() => {
                    if(this.state.username === ' '){
                      this.setState({username: ''})
                    }
                  }}
                  onChange={(env) => {
                    let value = env.target.value
                    this.setState(prev => {return {
                      ...prev,
                      username: value.toLowerCase()
                    }})
                  }}
                />
  
                Mật khẩu:
                  <Input
                    // placeholder="please input content"
                    // data-seed="logId"
                    type="password"
                    onChange={(env) => {
                      let value = env.target.value
                      this.setState(prev => {return {
                        ...prev,
                        password: value
                      }})
                    }}
                  />
                
                <Row className="mt10">
                  <Button
                    style={{}}
                    type="primary"
                    disabled={this.props.inProgress}
                    onClick={() => {
                      this.submitForm(username, password)
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Row>
                <ListErrors errors={this.props.errors} />
                
              </div>
            </div>

          </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
