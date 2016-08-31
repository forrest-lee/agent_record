import React from 'react';
import classNames from 'classnames';
import { Table, Button, Input, Spin, Select } from 'antd';
const InputGroup = Input.Group;

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as agencyActions from '../../action/agent';

var that;
const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (value, record) => <a href={'/#/user/' + record._id}>{value}</a>,
}, {
    title: '帐号',
    dataIndex: 'username',
    key: 'username'
}, {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile'
}, {
    title: '代理级别',
    dataIndex: 'role',
    key: 'role',
    render: (v, r) => {
        var roleType = '';
        switch(r.role) {
            case 0: roleType='总代理'; break;
            case 1: roleType='一级代理'; break;
            case 2: roleType='二级代理'; break;
            case 3: roleType='三级代理'; break;
            default: break;
        }
        return <span>{roleType}</span>;
    }
}, {
    title: '上级代理',
    dataIndex: 'parent',
    key: 'parent',
    render: (value, record) => <span>{record.parentId.name}</span>
}, {
    title: '子代理',
    render: (value, record) => {
        return <a href={'/#/agency/' + record._id + '/child'}>查看</a>
    }
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
            agency: []
        };
        that = this;
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />;
        }
        
        return (
            <div>
                <div>
                    {
                        sessionStorage.userRole != 0 ? <span></span> :
                            <Button type="primary" onClick={this.newClient.bind(this)}>新增</Button>
                    }
                    <SearchInput
                        placeholder="输入姓名查询代理"
                        style={{ width: 200, marginLeft: 10 }}
                        onSearch={value => {
                            this.setState({
                                agency: this.state.agency.filter(item => item.username.indexOf(value) >= 0)
                            });
                        }}
                    />
                    <Select defaultValue="1" style={{ width: 100, marginLeft: 10 }} onChange={this.chooseAgency}>
                        <Select.Option value="1">一级代理</Select.Option>
                        <Select.Option value="2">二级代理</Select.Option>
                        <Select.Option value="3">三级代理</Select.Option>
                        <Select.Option value="0">管理员</Select.Option>
                    </Select>
                </div>
                <div style={{marginTop: 20}}>
                    <Table dataSource={this.state.agency} columns={columns} />
                </div>
            </div>
        )
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/all?role=1',
            success: (res) => {
                if(res.err == 0) {
                    this.props.agencyActions.setAgents(res.users);
                    this.setState({
                        loading: false,
                        agency: res.users
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
    
    newClient() {
        window.location.hash = '/agency/new';
        this.setState({
            loading: true
        })
    }
    
    chooseAgency = (value) => {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/all?role=' + value,
            success: (res) => {
                if(res.err == 0) {
                    this.props.agencyActions.setAgents(res.users);
                    this.setState({
                        loading: false,
                        agency: res.users
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
    };
}

function mapStateToProps(state) {
    return {
        user:  state.user,
        agency: state.agency
    }
}

function mapDispatchToProps(dispatch) {
    return {
        agencyActions: bindActionCreators(agencyActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgentBox);