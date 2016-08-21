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
    
    if(!user.name) {
        replace({
            pathname: '/',
            state: { nextPathname: nextState.location.pathname }
        });
    }
    console.log(user.username);
}


import AppBox from './components/AppBox';
import MainBox from './components/MainBox';

import IndexPage from './components/index';
import Login from './components/user/Login';
import Register from './components/user/Register';
import ShowAgency from './components/agency/show';
import NewAgency from './components/agency/new';
import ShowClient from './components/client/show';
import Information from './components/upload/Infomation';   // 借款资料上传
import NotificationBox from './components/NotificationBox';

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
                <Route path='/' component={AppBox} >
                    <IndexRoute component={Login} />
            
                    <Route path='login' component={Login} onEnter={checkAuth}/>
                    <Route path='register' component={Register} />
            
                    <Route path='upload' component={MainBox} onEnter={checkAuth}>
                        <Route path='information' component={Information} />
                    </Route>
            
                    <Route path='notification' component={MainBox} onEnter={checkAuth}>
                        <Route path='all' component={NotificationBox} />
                    </Route>
            
                    <Route path='client' component={MainBox} onEnter={checkAuth}>
                        <Route path='all' component={ShowClient} />
                    </Route>
            
                    <Redirect from="agency" to="/agency/all"/>
                    <Route path='agency' component={MainBox} onEnter={checkAuth}>
                        <Route path='all' component={ShowAgency} />
                        <Route path='new' component={NewAgency} />
                    </Route>
                </Route>
            </Router>
        </Router>
    </Provider>
, document.getElementById('app-content'));
