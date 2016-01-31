import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { browserHistory } from 'react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as reducers from '../shared/reducers';
import routes from '../shared/routes';

// grab initial store state from the Window
let initialState = window.__INITIAL_STATE__;

const reducer = combineReducers(reducers);

// thunk store creator
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer, initialState);

render(
  <Provider store={store}>
      <Router children={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('react-view')
);
