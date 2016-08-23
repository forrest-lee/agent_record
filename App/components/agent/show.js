import React from 'react';
import classNames from 'classnames';
import { Table, Button, Input, Spin } from 'antd';
const InputGroup = Input.Group;

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as agentActions from '../../action/agent';

const columns = [{
    title: '姓名',
    dataIndex: 'username',
    key: 'username'
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
    username: '胡彦斌',
    role: 1,
    parent: '123',
    mobile: '123456',
    comment: '无'
}, {
    key: '2',
    username: '吴彦祖',
    role: 2,
    parent: '123',
    mobile: '654321',
    comment: '无'
}];

class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            focus: false
        }
    }
    
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
    }
    
    handleInputChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };
    
    handleFocusBlur = (e) => {
        this.setState({
            focus: e.target === document.activeElement,
        });
    };
    
    handleSearch = () => {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    };
    
}


class AgentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            agent: []
        }
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/all',
            success: (res) => {
                if(res.err == 0) {
                    this.props.agentActions.setAgents(res.users);
                    this.setState({
                        loading: false,
                        agent: res.users
                    })
                } else {
                    console.error(res.msg);
                }
            },
            error: (res) => {
                console.error(res);
            },
            complete: () => {
                this.setState({loading: false});
            }
            
        })
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
                        style={{ width: 200, marginLeft: 10 }}
                        onSearch={value => {
                            this.setState({
                                agent: this.state.agent.filter(item => item.username.indexOf(value) >= 0)
                            });
                        }}
                    />
                </div>
                <div style={{marginTop: 20}}>
                    <Table dataSource={this.state.agent} columns={columns} />
                </div>
            </div>
        )
    }
    
    newClient() {
        window.location.hash = '/agent/new';
        this.setState({
            loading: true
        })
    }
}

function mapStateToProps(state) {
    return {
        user:  state.user,
        agent: state.agent
    }
}

function mapDispatchToProps(dispatch) {
    return {
        agentActions: bindActionCreators(agentActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgentBox);