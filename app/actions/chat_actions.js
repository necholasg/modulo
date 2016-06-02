import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  MESSAGES,
  NEW_MESSAGE,
  CLEAR_MESSAGES,
  CHAT_USERS
} from './types';

export function fetchMessages(){
  return {
    type: MESSAGES
  }
}
export function addMessage(message){
  return {
    type: NEW_MESSAGE,
    payload:  message
  }
}
export function clearMessages(){
  return {
    type: CLEAR_MESSAGES
  }
}
export function fetchGuests(guests){
  return {
    type: CHAT_USERS,
    payload: guests
  }
}
