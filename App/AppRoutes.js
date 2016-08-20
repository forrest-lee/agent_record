import React from 'react';
import { Router, Route, Redirect, IndexRoute, browserHistory} from 'react-router';

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


function checkAuth(nextState, replaceState) {
    let { loggedIn } = store.getState();

    // check if the path isn't dashboard
    // that way we can apply specific logic
    // to display/render the path we want to
    if (nextState.location.pathname !== '/notification/all') {
        if (loggedIn) {
            if (nextState.location.state && nextState.location.pathname) {
                replaceState(null, nextState.location.pathname);
            } else {
                replaceState(null, '/');
            }
        }
    } else {
        // If the user is already logged in, forward them to the homepage
        if (!loggedIn) {
            if (nextState.location.state && nextState.location.pathname) {
                replaceState(null, nextState.location.pathname);
            } else {
                replaceState(null, '/');
            }
        }
    }
}


const AppRoutes = (
    <Router history={withBasename(browserHistory, __dirname)}>
        <Route path='/' component={AppBox} onEnter={checkAuth}>
            <IndexRoute component={Login} />

            <Route path='login' component={Login}/>
            <Route path='register' component={Register} />
            
            <Route path='upload' component={MainBox}>
                <Route path='information' component={Information} />
            </Route>
            
            <Route path='notification' component={MainBox}>
                <Route path='all' component={NotificationBox} />
            </Route>

            <Route path='client' component={MainBox}>
                <Route path='all' component={ShowClient} />
            </Route>

            <Redirect from="agency" to="/agency/all"/>
            <Route path='agency' component={MainBox}>
                <Route path='all' component={ShowAgency} />
                <Route path='new' component={NewAgency} />
            </Route>
        </Route>
    </Router>
);

export default AppRoutes;
