import {
  MESSAGES,
  NEW_MESSAGE,
  CLEAR_MESSAGES,
  CHAT_USERS
} from '../actions/types';

const initialState = {
  messages: [],
  guests: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case MESSAGES:
      return state;
    case NEW_MESSAGE:
      return {...state, messages: [...state.messages, action.payload]};
    case CLEAR_MESSAGES:
      return {...state,  messages: [], guests: [] };
    case CHAT_USERS:
      return {...state,  guests: action.payload };
  }
  return state;
}
