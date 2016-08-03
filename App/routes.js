import React from 'react';
import { Route, Redirect, IndexRoute} from 'react-router';

import Menu from './components/MenuBox';
import Client from './components/Client';

const AppRoutes = (
    <Route path="/" component={Menu}>
        <IndexRoute component={Client} />
        <Route path="clients" component={Client} />
    </Route>
);

export default AppRoutes;
