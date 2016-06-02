import axios from 'axios';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  DASH_INFO
} from './types';

export function signinUser({ email, password }) {
  return function (dispatch) {
    //submit email/ password to the server
    // { email: email, password: password } es6 below
    axios.post('/api/signin', { email, password })
      .then(response => {
        //if request was good
        cookie.save('loginResult', response.data.token);
        //-update state to indicate that user is authenticated
        dispatch({
          type: AUTH_USER,
          payload: response.data.username
        });
        //-redirect to the route /feature
        browserHistory.push('/dashboard');
      })
      .catch(() => {
        //if reuquest was bad
        //-Show Error to the User
        dispatch(authError('bad Login Info'));
      })

  }
}

export function signupUser({username, email, password}) {
  return function(dispatch) {
    axios.post('/api/signup', {username, email, password})
    .then(response => {
      //if request was good
      cookie.save('loginResult', response.data.token);
      //-update state to indicate that user is authenticated
      dispatch({
        type: AUTH_USER,
        payload: response.data.username
      });
      //-redirect to the route /feature
      browserHistory.push('/dashboard');
    })
    .catch(response => dispatch(authError(response.data.error)));
  }
}

export function authError (error){
  return {
    type: AUTH_ERROR,
    payload:  error
  }
}

export function signoutUser() {
  return function(dispatch) {
    cookie.remove('loginResult');
    dispatch({ type: UNAUTH_USER });
    axios.get('/api/signout')
    .then(response => {
      console.log(response.data.message);
    })
    .catch(response => {
      console.log('error in sign out');
    })
  }
}

export function dashInfo() {
  return function(dispatch){
    axios.get('/api/secret', {
      headers: { authorization: cookie.load('loginResult') }
    })
    .then(response => {
      dispatch({
        type: DASH_INFO,
        payload: response.data.message
      })
    })
  }
}
