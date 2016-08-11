/**
 * Created by leo on 8/12/16.
 */
import React from 'react';

import {Spin} from 'antd';

import HeaderBox from '../layout/HeaderBox';
import ContainerBox from '../layout/ContainerBox';

class MainBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <HeaderBox siderbar={'/' || sidebar}/>
                <ContainerBox>
                    {this.props.children || <Spin />}
                </ContainerBox>
            </div>
        );
    }
}

export default MainBox;