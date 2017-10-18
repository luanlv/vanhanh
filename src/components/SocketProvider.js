import React from 'react'
import PropTypes from 'prop-types'
import io from "socket.io-client";
import agent from '../agent'

class SocketProvicer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      message: null
    };
    this.socket = io(agent.API_ROOT_SOCKET)
  }

  getChildContext() {
    return {
      socket: this.socket
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

}

SocketProvicer.childContextTypes = {
  socket: PropTypes.object.isRequired
}

export default SocketProvicer