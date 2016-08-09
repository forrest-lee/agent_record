import React from 'react';
import classNames from 'classnames';
import {
    Table,
    Button,
    Input,
    Spin
} from 'antd';
const InputGroup = Input.Group;

import Link from 'react-router';

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile'
}, {
    title: '代理级别',
    dataIndex: 'role',
    key: 'role'
}, {
    title: '上级代理',
    dataIndex: 'parent',
    key: 'parent'
}, {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment'
}];

const dataSource = [{
    key: '1',
    name: '胡彦斌',
    role: 1,
    parent: 123,
    mobile: '123456',
    comment: '无'
}, {
    key: '2',
    name: '吴彦祖',
    role: 2,
    parent: 123,
    mobile: '654321',
    comment: '无'
}];

const SearchInput = React.createClass({
    getInitialState() {
        return {
            value: '',
            focus: false,
        };
    },
    handleInputChange(e) {
        this.setState({
            value: e.target.value,
        });
    },
    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    },
    handleSearch() {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    },
    render() {
        const { style, size, placeholder } = this.props;
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.value.trim(),
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus,
        });
        return (
            <div className="ant-search-input-wrapper" style={style}>
                <InputGroup className={searchCls}>
                    <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange}
                           onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
                    />
                    <div className="ant-input-group-wrap">
                        <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch} />
                    </div>
                </InputGroup>
            </div>
        );
    },
});

export default class ClientBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />;
        }
        
        return (
            <div>
                <div>
                    <Button type="primary" onClick={this.newClient.bind(this)}>新增</Button>
                    <SearchInput
                        placeholder="输入姓名查询代理"
                        onSearch={value => console.log(value)}
                        style={{ width: 200, marginLeft: 10 }}
                    />
                </div>
                <div style={{marginTop: 20}}>
                    <Table dataSource={dataSource} columns={columns} />
                </div>
            </div>
        )
    }
    
    newClient() {
        window.location.hash = '/agency/new';
        this.setState({
            loading: true
        })
    }
}