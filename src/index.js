import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calc from './Calc';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import * as serviceWorker from './serviceWorker';

const initialState = [
  'История операций: ',
];

function history(state = initialState, action){
  if (action.type === 'ADD_FORMULA') {
    return([
      ...state,
      action.payload
    ]);
  }
  return state;
}

const store = createStore(history, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <Calc />
  </Provider>
    , document.getElementById('root')
);



serviceWorker.unregister();
