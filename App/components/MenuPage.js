import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router'
import 'antd/dist/antd.css';

import {
    Menu,
    Button,
    Table,
    Spin,
    Form,
    Input,
    Row,
    Col,
    Icon,
    DatePicker
} from 'antd';

const FormItem = Form.Item;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class MenuPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {}

    render() {
        if (this.state.loading) {
            // return (
            //     <Spin />
            // );
        }

        return (
            <div style={{marginTop: 20}}>
                <Row>
                    <Col span={6}>
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 240 }}
                            defaultOpenKeys={['sub1', 'sub2']}
                            selectedKeys={[this.state.current]}
                            mode="inline"
                        >
                            <SubMenu key="sub1" title={<span><Icon type="mail"/> <span> 客户列表 </span></span>}>
                                <Menu.Item key='1'>全部客户</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span> <Icon type="appstore"/> <span> 代理列表 </span></span>}>
                                <Menu.Item key="2">全部代理</Menu.Item>
                                <Menu.Item key="3">二级代理</Menu.Item>
                                <Menu.Item key="4">三级代理</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                    <Col span={18}>
                        {this.props.children}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default MenuPage;
