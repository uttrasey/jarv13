import React from 'react';
import { Route } from 'react-router';
import App from './components';
import About from './components/about';
import NoMatch from './components/nomatch';

export default (
  <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="*" component={NoMatch} />
  </Route>
);
