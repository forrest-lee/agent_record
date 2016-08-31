import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router'

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

class MenuBox extends Component {
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
            <Menu
                onClick={this.handleClick}
                style={{ width: 240 }}
                defaultOpenKeys={['sub0', 'sub1', 'sub2', 'sub3']}
                selectedKeys={[this.state.current]}
                mode="inline"
            >
                <SubMenu key="sub0" title={<span><Icon type="book"/> <span> 公告 </span></span>}>
                    <Menu.Item key='0-0'>
                        <Link to='/notification/all'>系统公告</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub1" title={<span><Icon type="upload"/> <span> 上传 </span></span>}>
                    <Menu.Item key='1-0'>
                        <Link to='/upload/information'>借款资料上传</Link>
                    </Menu.Item>
                    <Menu.Item key='1-1'>
                        <Link to='/upload/contract'>借款合同上传</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="team"/> <span> 客户 </span></span>}>
                    <Menu.Item key='2-0'>
                        <Link to='/client/all'>全部列表</Link>
                    </Menu.Item>
                    <Menu.Item key='2-1'>
                        <Link to='/client/status/0'>待审核列表</Link>
                    </Menu.Item>
                    <Menu.Item key='2-2'>
                        <Link to='/client/status/1'>成功列表</Link>
                    </Menu.Item>
                    <Menu.Item key='2-3'>
                        <Link to='/client/status/2'>拒绝列表</Link>
                    </Menu.Item>
                    <Menu.Item key='2-4'>
                        <Link to='/client/status/3'>退回列表</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span> <Icon type="user"/> <span> 代理 </span></span>}>
                    {
                        (() => {
                            if(sessionStorage.userRole == 0) {
                                return (
                                    <Menu.Item key="3-0">
                                        <Link to='/agency/new'>新增代理</Link>
                                    </Menu.Item>
                                )
                            }
                        })()
                    }
                    <Menu.Item key="3-1">
                        <Link to='/agency/all'>代理列表</Link>
                    </Menu.Item>
                </SubMenu>
    
                <SubMenu key="sub4" title={<span><Icon type="setting"/> <span> 帐户 </span></span>}>
                    <Menu.Item key='2-0'>
                        <Link to='/client/all'>修改密码</Link>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default MenuBox;
