import React, {Component} from 'react';

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
    DatePicker
} from 'antd';

const FormItem = Form.Item;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const columns = [{
    title: '职位名称',
    dataIndex: 'position_name',
    key: 'position_name'
}, {
    title: '公司简称',
    dataIndex: 'company_short',
    key: 'company_short'
}, {
    title: '融资规模',
    dataIndex: 'finance_stage',
    key: 'finance_stage'
}];

export default class ClientBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div></div>
        )
    }
}