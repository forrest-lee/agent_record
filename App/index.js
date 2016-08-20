import 'antd/dist/antd.css';
import React                      from 'react';
import ReactDOM                   from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import {createHashHistory}        from 'history';
import AppRoutes                  from './AppRoutes';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import homeReducer from './reducer';


// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(homeReducer);

ReactDOM.render(
    <Provider store={store}>
        <Router
            history={useRouterHistory(createHashHistory)({queryKey: true})}
            onUpdate={() => window.scrollTo(0, 0)}
        >
            {AppRoutes}
        </Router>
    </Provider>
, document.getElementById('app-content'));
