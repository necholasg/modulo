import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Board from './board';

class Chat extends Component {

  state = {
    message: ''
  };

  componentDidMount() {
    if (socket) {
      socket.on('msg', this.onMessageReceived);
    }
    setTimeout(() => {
      socket.emit('newUser', this.props.user);
      socket.on('allUsers', this.onNewUser);
    }, 100);
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('msg', this.onMessageReceived);
    }
  }

  onMessageReceived = (data) => {
    this.props.addMessage(data);
  }

  onNewUser = (data) => {
    this.props.fetchGuests(data);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const msg = this.state.message;

    this.setState({message: ''});

    socket.emit('msg', {
      from: this.props.user,
      text: msg
    });
  }

  render() {
    const { user, users } = this.props;

    return (
      <div>
        <div className='container-fluid chat'>
          <div className='hidden-xs hidden-sm col-md-3 membersBox'>
            <h3>Whos Here?</h3>
            <ul>
              {users.map((obj) => {
                return <li key={obj.id}><h3>{obj.name}</h3></li>
              })}
            </ul>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-9 chatBox">
            <h2>Say Somthing</h2>
            {user &&
            <div>
              <div className='textSpace'>
                <ul >
                {this.props.messages.map((msg) => {
                  return <li key={`chat.msg.${msg.id}`}><strong>{msg.from}</strong>: {msg.text}</li>;
                })}
                </ul>
              </div>
              <div>
                <form onSubmit={this.handleSubmit}>
                  <div className="input-group">
                    <input type="text" ref="message" className='form-control' placeholder="Enter your message"
                     value={this.state.message}
                     onChange={(event) => {
                       this.setState({message: event.target.value});
                     }
                    }/>
                  <span className="input-group-btn">
                      <button className="btn btn-success" type="button" onClick={this.handleSubmit}>Send</button>
                    </span>
                  </div>
                </form>
              </div>
            </div>
            }
          </div>
        </div>
        <Board />
      </div>

    );
  }
}

function mapStateToProps(state){
  return {
    user: state.auth.user,
    messages: state.chat.messages,
    users: state.chat.guests
  };
}

export default connect(mapStateToProps, actions)(Chat);
