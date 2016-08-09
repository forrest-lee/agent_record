import React from 'react';
import { Router, Route, Redirect, IndexRoute, browserHistory} from 'react-router';

import IndexPage from './components/index';

import ShowClient from './components/agency/show';
import NewClient from './components/agency/new';

import useBasename from 'history/lib/useBasename'

// This helper is for setting basename on examples with minimal boilerplate. In
// an actual application, you would build a custom history to set basename.
export default function withBasename(history, dirname) {
    return useBasename(() => history)({ basename: `/${dirname}` })
}


import HeaderBox from './layout/HeaderBox';
import ContainerBox from './layout/ContainerBox';
const App = ({ content, sidebar }) => (
    <div>
        <HeaderBox siderbar={'/' || sidebar}/>
        <ContainerBox>
            {content || <IndexPage />}
        </ContainerBox>
    </div>
);


const AppRoutes = (
    <Router history={withBasename(browserHistory, __dirname)}>
        <Route path='/' component={App}>
            <IndexRoute component={App} />
        
            <Redirect from="client" to="/client/show"/>
            <Route path='client'>
                <Route path='show' component={{ content: ShowClient, sidebar: 'showClients' }} />
                <Route path='new' component={{ content: NewClient, sidebar: 'newClient' }} />
            </Route>
        </Route>
    </Router>
);

export default AppRoutes;
