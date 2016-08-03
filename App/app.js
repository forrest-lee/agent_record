import 'antd/dist/antd.css';
import React                      from 'react';
import ReactDOM                   from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import {createHashHistory}        from 'history';
import AppRoutes                  from './routes';
import Header                     from './layout/HeaderBox';

ReactDOM.render(
    <div>
        <Header />
        <Router
            history={useRouterHistory(createHashHistory)({queryKey: true})}
            onUpdate={() => window.scrollTo(0, 0)}
        >
            {AppRoutes}
        </Router>
    </div>
, document.getElementById('app-content'));
