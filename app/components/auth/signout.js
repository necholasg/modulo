import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
const bye = require('../../../style/images/bye.png');

class Signout extends Component {
  componentWillMount() {
    this.props.signoutUser();
    this.props.clearMessages();
    socket.emit('loggedOut');
  }
  render () {
    return (
      <div className='goodBye'>
        <div className='item'>
          <img src={bye}/>
          <h1>Come Back Soon!</h1>
        </div>
      </div>
    )
  }
}

export default connect(null, actions)(Signout)
