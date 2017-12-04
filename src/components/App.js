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
import SocketProvider from './SocketProvider'

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
    let DO5days = await agent.DieuHanh.getDOs5Day()
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
            <SocketProvider>
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
                        defaultOpenKeys={['duyetchiphi', 'lenhdieuxe', 'thongke', 'thuquy', 'duyetchinhsua']}
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

                      {/*<Menu.Item key="lenhdieuxe3">*/}
                        {/*<Link to="#" >Lịch sử</Link>*/}
                      {/*</Menu.Item>*/}

                    </SubMenu>}

                    {(intersection(role, [1004, 1005]).length > 0) && <SubMenu
                      key="duyetchiphi"
                      title={<span><Icon type="idcard" /><span className="nav-text">Chi phí</span></span>}
                    >
                      {(intersection(role, [1004]).length > 0) && <Menu.Item key="duyetchiphi1">
                        <Link to={"duyetchiphi"} >Duyệt chi phí (Điều hành)</Link>
                      </Menu.Item>}

                      {(intersection(role, [1005]).length > 0) && <Menu.Item key="duyetchiphi2">
                        <Link to={"duyetchiphiketoan"} >Chi phí (Kế toán)</Link>
                      </Menu.Item>}

                      {/*{(intersection(role, [1005, 1004]).length > 0) && <Menu.Item key="duyetchiphi3">*/}
                        {/*<Link to={"baocaochiphi"} >Báo cáo</Link>*/}
                      {/*</Menu.Item>}*/}
                      {/*<Menu.Item key="lenhdieuxe3">*/}
                      {/*<Link to="#" >Lịch sử</Link>*/}
                      {/*</Menu.Item>*/}

                    </SubMenu>}


                    {(intersection(role, [1006]).length > 0) && <SubMenu
                      key="duyetchinhsua"
                      title={<span><Icon type="idcard" /><span className="nav-text">Chỉnh sửa lệnh</span></span>}
                    >
                      <Menu.Item key="duyetchinhsua1">
                        <Link to={"duyetchinhsua"} >Lệnh chờ duyệt</Link>
                      </Menu.Item>

                      {/*{(intersection(role, [1005, 1004]).length > 0) && <Menu.Item key="duyetchiphi3">*/}
                      {/*<Link to={"baocaochiphi"} >Báo cáo</Link>*/}
                      {/*</Menu.Item>}*/}
                      {/*<Menu.Item key="lenhdieuxe3">*/}
                      {/*<Link to="#" >Lịch sử</Link>*/}
                      {/*</Menu.Item>*/}

                    </SubMenu>}

                    {/*<SubMenu*/}
                      {/*key="thuquy"*/}
                      {/*title={<span><Icon type="idcard" /><span className="nav-text">Thủ quỹ</span></span>}*/}
                    {/*>*/}
                      {/*<Menu.Item key="thuquy1">*/}
                        {/*<Link to="thuchi" >Thu/Chi</Link>*/}
                      {/*</Menu.Item>*/}
                    {/*</SubMenu>*/}


                    <SubMenu
                      key="thongke"
                      title={<span><Icon type="idcard" /><span className="nav-text">Báo cáo</span></span>}
                    >
                      <Menu.Item key="thongke">
                        <Link to="/thongke" >Tổng hợp</Link>
                      </Menu.Item>
                      <Menu.Item key="thongketheolaixe">
                        <Link to="/thongketheolaixe" >Theo lái xe</Link>
                      </Menu.Item>
                      <Menu.Item key="thongketheoxe">
                        <Link to="/thongketheoxe" >Theo xe</Link>
                      </Menu.Item>
                      <Menu.Item key="thongketheothauphu">
                        <Link to="/thongketheothauphu" >Theo thầu phụ</Link>
                      </Menu.Item>
                      <Menu.Item key="thongketheokhachhang">
                        <Link to="/thongketheokhachhang" >Theo khách hàng</Link>
                      </Menu.Item>
                      {/*<Menu.Item key="bieudo">*/}
                        {/*<Link to="/bieudo" >Biểu đồ</Link>*/}
                      {/*</Menu.Item>*/}

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
            </SocketProvider>
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
  router: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
