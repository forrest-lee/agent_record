/**
 * Created by leo on 8/12/16.
 */
import React from 'react';
import classNames from 'classnames';
import {
    Select,
    Menu,
    Row,
    Col,
    Icon,
    Button,
    Breadcrumb
} from 'antd';

import styles from './styles.scss';
let cx = classNames.bind(styles);

class HeaderBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
    render() {
        return <span></span>;
        
        //return (
        //    <div style={{marginBottom: 20}}>
        //        <Breadcrumb>
        //            <Breadcrumb.Item href="">
        //                <Icon type="home" />
        //                <span>Home</span>
        //            </Breadcrumb.Item>
        //            <Breadcrumb.Item href="">
        //                <span>xx</span>
        //            </Breadcrumb.Item>
        //            <Breadcrumb.Item>
        //                xxxx
        //            </Breadcrumb.Item>
        //        </Breadcrumb>
        //    </div>
        //);
    }
}

export default HeaderBox;