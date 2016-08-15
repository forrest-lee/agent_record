import React from 'react';

import HeaderBox from '../layout/HeaderBox';

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderBox />
                <h1>欢迎使用小微学贷</h1>
            </div>
        );
    }
}