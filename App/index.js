import 'antd/dist/antd.css';
import 'babel-polyfill';

import React    from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import {
    Router,
    Route,
    Redirect,
    IndexRoute,
    browserHistory,
    useRouterHistory
} from 'react-router';

import homeReducer from './reducer/index';


// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(homeReducer, window.devToolsExtension ? window.devToolsExtension() : undefined);



function checkAuth(nextState, replace) {
    let { user } = store.getState();
    
    if (sessionStorage.userId) {
        // TODO: CheckUserExist
        return;
    } else {
        window.location.href = '/#/login';
    }
}


import AppBox from './components/AppBox';
import MainBox from './components/MainBox';
import IndexPage from './components/index';
import Login from './components/user/Login';
import Register from './components/user/Register';
import ShowAgency from './components/agency/show';
import NewAgency from './components/agency/new';
import ChildAgency from './components/agency/child';
import ShowClient from './components/client/show';
import Notification from './components/notification/detail';
import NotificationBox from './components/notification/NotificationBox';
import NewNotification from './components/notification/new';
import InfoForm from './components/upload/InfoForm';   // 借款资料上传
import InfoDetail from './components/upload/index';

import useBasename from 'history/lib/useBasename';

// This helper is for setting basename on examples with minimal boilerplate. In
// an actual application, you would build a custom history to set basename.
export default function withBasename(history, dirname) {
    return useBasename(() => history)({ basename: `/${dirname}` })
}


ReactDOM.render(
    <Provider store={store}>
        <Router
            history={useRouterHistory(createHashHistory)({queryKey: true})}
            onUpdate={() => window.scrollTo(0, 0)}
        >
            <Router history={withBasename(browserHistory, __dirname)}>
                <Route path='/' component={AppBox} onEnter={checkAuth}>
                    <IndexRoute component={Login} />
            
                    <Route path='login' component={Login} />
                    <Route path='register' component={Register} />
            
                    <Route path='upload' component={MainBox} >
                        <Route path='information' component={InfoForm} />
                        <Route path='contract'    component={InfoForm} />
                    </Route>
    
                    <Route component={MainBox} >
                        <Route path='information/:id' component={InfoDetail} />
    
                        <Route path='notification'>
                            <Route path='all' component={NotificationBox} />
                            <Route path='new' component={NewNotification} />
                            <Route path=':id' component={Notification} />
                        </Route>
    
                        <Route path='client'>
                            <Route path='all' component={ShowClient} />
                        </Route>
                        <Route path='client/status/:id' component={ShowClient} />
    
                        <Redirect from="agency" to="/agent/all"/>
                        <Route path='agency'>
                            <Route path='all' component={ShowAgency} />
                            <Route path='new' component={NewAgency} />
                        </Route>
                        <Route path='agency/:id/child' component={ChildAgency} />
                    </Route>
                    
                </Route>
            </Router>
        </Router>
    </Provider>
, document.getElementById('app-content'));
