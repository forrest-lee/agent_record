import React from 'react';
import classNames from 'classnames';
import { Table, Button, Input, Spin, Select, notification } from 'antd';
import SearchInput from '../SearchInput';
const InputGroup = Input.Group;

var that;
const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (value, record) => {
        if(record.status == -1) {
            return <span>{value} (已注销)</span>;
        } else {
            return <a href={'/#/user/' + record._id}>{value}</a>;
        }
    },
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
            case 0: roleType='风控'; break;
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
    render: (value, record) => record.role !=0 ? <span>{record.parentId.name}</span> : <span>无</span>
}, {
    title: '子代理',
    render: (value, record) => {
        return <a href={'/#/agency/' + record._id + '/child'}>修改</a>
    }
}];



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
        
        var userRole = parseInt(sessionStorage.userRole);
        var select;
        switch(userRole) {
            case 0:
                select = (
                    <Select defaultValue="1" style={{ width: 100, marginLeft: 10 }} onChange={this.chooseAgency}>
                        <Select.Option value="1">一级代理</Select.Option>
                        <Select.Option value="2">二级代理</Select.Option>
                        <Select.Option value="3">三级代理</Select.Option>
                        <Select.Option value="0">管理员</Select.Option>
                    </Select>
                );
                break;
            case 1:
                select = (
                    <Select defaultValue="2" style={{ width: 100, marginLeft: 10 }} onChange={this.chooseAgency}>
                        <Select.Option value="2">二级代理</Select.Option>
                        <Select.Option value="3">三级代理</Select.Option>
                    </Select>
                );
                break;
            case 2:
                select = (
                    <Select defaultValue="3" style={{ width: 100, marginLeft: 10 }} onChange={this.chooseAgency}>
                        <Select.Option value="3">三级代理</Select.Option>
                    </Select>
                );
                break;
        }
        
        return (
            <div>
                <div>
                    {
                        sessionStorage.userRole != 0 ? <span></span> :
                            <Button type="primary" onClick={this.newClient.bind(this)}>新增</Button>
                    }
                    <SearchInput
                        placeholder="输入标题查询代理"
                        style={{ width: 200, marginLeft: 10 }}
                        onSearch={value => {
                            this.fetchAll((users) => {
                                this.setState({
                                    agency: users.filter(item => item.name.indexOf(value) >= 0)
                                });
                            })
                        }}
                    />
                    {select}
                    <Button style={{marginLeft: 10}} onClick={this.fetchAll}>查看全部</Button>
                </div>
                <div style={{marginTop: 20}}>
                    <Table dataSource={this.state.agency} columns={columns} />
                </div>
            </div>
        )
    }
    
    componentWillMount() {
        var userRole = parseInt(sessionStorage.userRole);
        var queryRole =  userRole == 3 ? 3 : userRole + 1;
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/all?role=' + queryRole,
            success: (res) => {
                if(res.err == 0) {
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
    
    fetchAll = (callback) => {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/all',
            beforeSend: () => {
                this.setState({loading: true});
            },
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        loading: false,
                        agency: res.users
                    });
                    if(callback) {
                        callback(res.users);
                    }
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.msg
                    });
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
    
    chooseAgency = (value) => {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/all?role=' + value,
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        loading: false,
                        agency: res.users
                    })
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.msg
                    });
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
export default AgentBox;