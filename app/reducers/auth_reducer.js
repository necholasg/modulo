import cookie from 'react-cookie';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  DASH_INFO
} from '../actions/types';


export default function(state = {}, action) {
  switch(action.type) {
    case AUTH_USER:
      return {...state, error: '', authenticated: true, user: action.payload };
    case UNAUTH_USER:
      return {...state, authenticated: false, user: null };
    case AUTH_ERROR:
      return {...state, error: action.payload };
    case DASH_INFO:
      return {...state, message: action.payload };
  }
  return state;
}
