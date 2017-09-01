import agent from '../agent';
// import Header from './Header';
import { Login } from './_components'
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT,
  LOGOUT} from '../constants/actionTypes';
import { Layout, Menu, Breadcrumb, Icon, LocaleProvider, Button, Spin, DatePicker } from 'antd';
import {Link} from 'react-router'
import enUS from 'antd/lib/locale-provider/en_US';
import viVN from 'antd/lib/locale-provider/vi_VN';
import moment from 'moment'

import intersection from 'lodash/intersection'

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

const mapStateToProps = state => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  redirectTo: state.common.redirectTo
});

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
});



class App extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      name: this.props.name,
      collapsed: false,
      mode: 'inline',
    };
  }
  
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      this.context.router.replace(nextProps.redirectTo);
      this.props.onRedirect();
    }
  }

  componentWillMount = async() => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }
    this.props.onLoad(token ? agent.Auth.current() : null, token);
  
    const date = await agent.DieuHanh.getDate();
    // console.log(date)
    this.setState({
      date: date.date
    })
  }
  
  render() {
    if (this.props.appLoaded) {
      if (!this.props.currentUser) {
        return (<div id="login">
          <Login />
        </div>)
      } else {
        const role = this.props.currentUser.role
        return (
          <LocaleProvider locale={viVN}>
            <Layout>
              <Sider
                collapsible
                breakpoint="lg"
                collapsedWidth="0"
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
                width="170"
              >
                <div className="logo" />
                <div className="admin-topSlide">
                  <span>COLOMBUS</span>
                </div>
                <Menu theme="dark"
                      mode={this.state.mode}
                      selectedKeys={[this.props.name]}
                      defaultOpenKeys={['lenhdieuxe', 'thongke']}
                >
                  <Menu.Item key="Dashboard">
                    <Link to="/">
                  <span>
                    <Icon type="layout" />
                    <span className="nav-text">Dashboard</span>
                  </span>
                    </Link>
                  </Menu.Item>
                  
                  {(intersection(role, [302, 101, 201, 1002]).length > 0) && <SubMenu
                    key="lenhdieuxe"
                    title={<span><Icon type="idcard" /><span className="nav-text">Lệnh điều xe</span></span>}
                  >
                    <Menu.Item key="lenhdieuxe1">
                      <Link to={"do/dieuxe"} >Lệnh điều xe</Link>
                    </Menu.Item>
                    
                    <Menu.Item key="lenhdieuxe3">
                      <Link to="#" >Lịch sử</Link>
                    </Menu.Item>
                    
                  </SubMenu>}
  
                  {/*<SubMenu*/}
                    {/*key="laixe"*/}
                    {/*title={<span><Icon type="idcard" /><span className="nav-text">Lái xe</span></span>}*/}
                  {/*>*/}
                    {/*<Menu.Item key="laixe1">*/}
                      {/*<Link to="#" >Thêm lái xe</Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="laixe2">*/}
                      {/*<Link to="#" >Danh sách lái xe</Link>*/}
                    {/*</Menu.Item>*/}
                  {/*</SubMenu>*/}
  
  
                {/*  <SubMenu
                    key="thauphu"
                    title={<span><Icon type="idcard" /><span className="nav-text">Thầu phụ</span></span>}
                  >
                    <Menu.Item key="thauphu1">
                      <Link to="#" >Thêm thầu phụ</Link>
                    </Menu.Item>
                    <Menu.Item key="thauphu2">
                      <Link to="#" >Danh sách thầu phụ</Link>
                    </Menu.Item>
                  </SubMenu>*/}
  
                  {/*<SubMenu*/}
                    {/*key="xe"*/}
                    {/*title={<span><Icon type="idcard" /><span className="nav-text">Xe</span></span>}*/}
                  {/*>*/}
                    {/*<Menu.Item key="xe1">*/}
                      {/*<Link to="#" >Thêm xe mới</Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="xe2">*/}
                      {/*<Link to="#" >Danh sách xe</Link>*/}
                    {/*</Menu.Item>*/}
                  {/*</SubMenu>*/}
  
                  {/*<SubMenu*/}
                    {/*key="nhansu"*/}
                    {/*title={<span><Icon type="idcard" /><span className="nav-text">Nhân sự</span></span>}*/}
                  {/*>*/}
                    {/*<Menu.Item key="nhansu1">*/}
                      {/*<Link to="phongban" >Bộ phận/phòng/ban</Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="nhansu2">*/}
                      {/*<Link to="nhanvien" >Nhân sự</Link>*/}
                    {/*</Menu.Item>*/}
                  {/*</SubMenu>*/}
  
                  {/*<SubMenu*/}
                    {/*key="thuquy"*/}
                    {/*title={<span><Icon type="idcard" /><span className="nav-text">Thủ quỹ</span></span>}*/}
                  {/*>*/}
                    {/*<Menu.Item key="thuquy1">*/}
                      {/*<Link to="#" >Khai báo thu/chi</Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="thuquy2">*/}
                      {/*<Link to="#" >Lịch sử</Link>*/}
                    {/*</Menu.Item>*/}
                  {/*</SubMenu>*/}
  
                  
                  {/*<SubMenu*/}
                    {/*key="ketoan"*/}
                    {/*title={<span><Icon type="idcard" /><span className="nav-text">Kế toán</span></span>}*/}
                  {/*>*/}
                    {/*<Menu.Item key="ketoan1">*/}
                      {/*<Link to="#" >Giá chuyến</Link>*/}
                    {/*</Menu.Item>*/}
                  {/*</SubMenu>*/}
                  
                  
                  <SubMenu
                    key="thongke"
                    title={<span><Icon type="idcard" /><span className="nav-text">Thống kê</span></span>}
                  >
                    <Menu.Item key="thongke">
                      <Link to="/thongke" >Theo ngày/Thầu phụ</Link>
                    </Menu.Item>
                  
                  </SubMenu>
                  
                  
                </Menu>
              </Sider>
      
              <Layout>
                <Header style={{ height: 47, background: 'white', padding: 0}} >
                  <Button type="ghost"
                          style={{float: 'right', margin: 10 }}
                          onClick={this.props.onClickLogout}
                  >Đăng xuất</Button>
                </Header>
                <Content style={{ margin: '0 5px' }}>
                  <div style={{background: '#fff', minHeight: 500 }}>
                    {this.props.children}
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center'}}>
                  Admin Page ©201 Created by Lưu Văn Luận
                </Footer>
              </Layout>
            </Layout>
          </LocaleProvider>
        )
      }
    }
    return (
      <div style={{textAlign: 'center', paddingTop: 50}}>
        <Spin  size="large" tip="Đang tải..." />
      </div>
    );
  }
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
