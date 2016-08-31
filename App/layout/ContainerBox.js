import React from 'react';
import classNames from 'classnames';
import { Select, Menu, Row, Col, Icon, Button } from 'antd';

import styles from './styles.scss';
let cx = classNames.bind(styles);

import MenuBox from '../components/MenuBox';

class ContainerBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let style = {
            title: cx({
                'title': true
            }),
            mainWrapper: cx({
                'mainWrapper': true
            })
        };
    
        var roleType = sessionStorage.userRole == 0 ? '总代理' :
            sessionStorage.userRole == 1 ? '一级代理' :
                sessionStorage.userRole == 2 ? '二级代理' :
                    sessionStorage.userRole == 3 ? '三级代理' : '无';
                
        
        return (
            <div className={style.mainWrapper}>
                <Row>
                    <Col className={'ant-col-sm-8 ant-col-md-6'} style={{paddingBottom: 50}}>
                        <MenuBox />
                    </Col>
                    <Col className={'main-container ant-col-sm-16 ant-col-md-18'}>
                        <span style={{float: 'right'}}>
                            当前用户: {sessionStorage.username} ({sessionStorage.nameStr}) [{roleType}]
                        </span>
                        
                        {this.props.children}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ContainerBox;