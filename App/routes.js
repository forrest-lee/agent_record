import React from 'react';
import { Route, Redirect, IndexRoute} from 'react-router';

import Menu from './components/MenuBox';
import Client from './components/client/show';

const AppRoutes = (
    <Route path='/' component={Client}>
        <IndexRoute component={Client} />
        <Route path='clients'>
            <Route path='' component={Client} />
        </Route>
    </Route>
);

export default AppRoutes;
