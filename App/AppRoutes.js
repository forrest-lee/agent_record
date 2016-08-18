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


const AppRoutes = (
    <Router history={withBasename(browserHistory, __dirname)}>
        <Route path='/' component={AppBox}>
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
