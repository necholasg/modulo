import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Chat from './chat';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <Chat />
      </div>
    )
  }
}

function mapStateToProps (state){
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(Dashboard);
