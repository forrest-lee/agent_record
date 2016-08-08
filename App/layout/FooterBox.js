import React from 'react';
import classNames from 'classnames';
import { Select, Menu, Row, Col, Icon, Button } from 'antd';

import styles from './styles.scss';
let cx = classNames.bind(styles);

class FooterBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
    render() {
        let style = {
            title: cx({
                title: true
            })
        };
        return (
            <header id="header">
                <Row style={{backgroundColor: '#3A99D8', height: 80}}>
                    <Col lg={4} md={6} sm={7} xs={24}>
                        <h1 className={style.title}>小薇学贷</h1>
                    </Col>
                    <Col className={`nav nav-show`}
                         lg={20} md={18} sm={17} xs={0} style={{display: 'block'}}
                    >
                        <Button
                            type="primary"
                            icon="poweroff"
                            style={{
                                height: 36,
                                backgroundColor: '#EB5768',
                                float: 'right',
                                marginTop: 22,
                                marginRight: 22
                            }}
                        >
                            退出
                        </Button>
                    </Col>
                </Row>
            </header>
        );
    }
}

export default FooterBox;