import React from 'react';
import { Route, Redirect, IndexRoute} from 'react-router';

import MenuPage from './components/MenuPage';
import Client from './components/Client';

const AppRoutes = (
    <Route path="/" component={MenuPage}>
        <IndexRoute component={Client} />
        <Route path="clients" component={Client} />
    </Route>
);

export default AppRoutes;
