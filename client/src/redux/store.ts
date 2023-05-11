import { createStore } from 'redux';

// Initial state object
const initialState = {
  joinCode: ''
};

type action = {
  type: string,
  payload: string
};

// Reducer function
const reducer = (state = initialState, action:action ) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, joinCode: action.payload };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer);

export default store;
