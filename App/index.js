import 'antd/dist/antd.css';
import React                      from 'react';
import ReactDOM                   from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import {createHashHistory}        from 'history';
import AppRoutes                  from './AppRoutes';


ReactDOM.render(
    <Router
        history={useRouterHistory(createHashHistory)({queryKey: true})}
        onUpdate={() => window.scrollTo(0, 0)}
    >
        {AppRoutes}
    </Router>
, document.getElementById('app-content'));
