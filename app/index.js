import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import reduxThunk from 'redux-thunk';
import { AUTH_USER } from './actions/types'
import routes from './routes';
import reducers from './reducers';
import cookie from 'react-cookie';
import io from 'socket.io-client';
import {persistStore, autoRehydrate} from 'redux-persist';

const store = createStore(reducers, undefined, compose(
  applyMiddleware(reduxThunk), autoRehydrate(), window.devToolsExtension ? window.devToolsExtension() : f => f
));
persistStore(store);

function initSocket() {
  const socket = io();
  socket.on('news', (data) => {
    console.log(data);
    socket.emit('otherNews', { my: 'data from client' });
  });
  // socket.on('msg', (data) => {
  //   console.log(data);
  // });
  return socket;
}

global.socket = initSocket();

const token = cookie.load('loginResult') || null;
// if we have a token, consider the user to be signed in
if (token) {
  //we need to update the application state
  store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}  />
  </Provider>
  , document.getElementById('app'));
