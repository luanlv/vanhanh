import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  LAIXE_DO_LOADED
} from '../../constants/actionTypes';

import {Button, Row, Icon, Spin, message} from 'antd'
import ReactList from 'react-list';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import moment from 'moment'

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.laixe,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),

  onLoad: ( payload) =>
    dispatch({ type: LAIXE_DO_LOADED, payload }),
});

class ListDO extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      init: false,
      laixe: []
    }
  }

  componentWillMount() {
    this.init()
  }
  
  init() {
    agent.ThauPhu.danhsachLaiXe()
      .then(res => {
        this.setState(prev => { return {
          ...prev,
          init: true,
          laixe: res
        }})
      })
  }

  componentWillUnmount() {
    // this.props.onUnload();
  }
  

  render() {
    let that = this
    return (
      <div className="listDO-page">
        <Row className="laixe-listDO-Wr">
          <h2 className="mb20 mt10 textCenter">Danh sach DO</h2>
          {this.state.init && (
              <div style={{overflow: 'auto', maxHeight: '80vh'}}>
                <Table>
                  <Thead>
                  <Tr>
                    <Th/>
                    <Th>Ten Lai Xe</Th>
                  </Tr>
                  </Thead>
                  <Tbody>
                  {this.state.laixe.map((el, index) => {
                    return (
                      <Tr key={index}>
                        <Td>
                          <Icon type="eye" style={{cursor: 'pointer', fontSize: 32, color: '#08c' }} />
                        </Td>
                        <Td>{el.name}</Td>
                      </Tr>
                    )
                    })
                  }
                  </Tbody>
                </Table>
              </div>
          )}
          {!this.state.init && (
            <div style={{textAlign: 'center', paddingTop: 50}}>
              <Spin tip="Loading..." />
            </div>
          )}
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDO);
