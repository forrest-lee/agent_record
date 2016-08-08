import 'antd/dist/antd.css';
import React                      from 'react';
import ReactDOM                   from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import {createHashHistory}        from 'history';
import AppRoutes                  from './routes';

import Header    from './layout/HeaderBox';
import Container from './layout/ContainerBox';

ReactDOM.render(
    <div>
        <Header />
        <Container>
            <Router
                history={useRouterHistory(createHashHistory)({queryKey: true})}
                onUpdate={() => window.scrollTo(0, 0)}
            >
                {AppRoutes}
            </Router>
        </Container>
    </div>
, document.getElementById('app-content'));
