import React from 'react';
import path from 'path'
import express from 'express';
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createLocation from 'history/lib/createLocation';
import thunk from 'redux-thunk';
import * as reducers from '../shared/reducers';
import routes from '../shared/routes';
import fetchComponentData from '../shared/lib/fetchComponentData';

const app = express();

// serve CSS
const PATH_STYLES = path.resolve(__dirname, '../client/styles');
app.use('/styles', express.static(PATH_STYLES));

// serve bundled js
const PATH_DIST = path.resolve(__dirname, '../../dist');
app.use(express.static(PATH_DIST));

// serve up isomorphic
app.use((req, res) => {
    const location = createLocation(req.url);
    const reducer = combineReducers(reducers);

    const store = applyMiddleware(thunk)(createStore)(reducer);

    match({ routes, location }, (err, redirectLocation, renderProps) => {
        function renderView() {
            const initialState = store.getState();

            const InitialComponent = (
                <Provider store={store}>
                     <RouterContext {...renderProps} />
                </Provider>
            );

            const componentHTML = renderToString(InitialComponent);
            const HTML = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>Jarv13</title>
                  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
                  <link rel="stylesheet" href="/styles/main.css" />
                  <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon" />


                  <script type="application/javascript">
                      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
                  </script>
                </head>
                <body>
                  <div id="react-view">${componentHTML}</div>
                  <script type="application/javascript" src="/bundle.js"></script>
                </body>
            </html>
            `
            res.end(HTML);
        }

        // run all required async actions so store is legit to render
        fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
            .then(renderView)
            .then(html => res.end(html))
            .catch(error => res.end(error.message));
    });
});

export default app;
