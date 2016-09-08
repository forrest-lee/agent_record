import React from 'react';
import dateformat from 'dateformat';
import classNames from 'classnames';
import { Table, Button, Input, Spin, Menu, Dropdown, Icon, notification } from 'antd';
const InputGroup = Input.Group;
import SearchInput from '../SearchInput';


const columns = [{
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (v, r) => <span>{v == 0 ? '资料上传' : '合同上传'}</span>
}, {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: (value, record) => <a href={'/#/information/' + record._id}>{value}</a>,
}, {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile'
}, {
    title:     '更新时间',
    dataIndex: 'updateAt',
    key:       'updateAt',
    render:    (value, record) => <span>{dateformat(value, 'yyyy-mm-dd HH:MM:ss')}</span>
}, {
    title: '提交人',
    dataIndex: 'agentId',
    key: 'agentId',
    render: (v, r) => {
        if(r.agentId.status == -1) {
            return <span>{r.agentId.name} (已注销)</span>
        } else {
            return <span>{r.agentId.name}</span>
        }
    }
}, {
    title: '代理级别',
    dataIndex: 'role',
    key: 'role',
    render: (v, r) => {
        var roleType = '';
        switch(r.agentId.role) {
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
    render:    (value, record) => {
        if(record.agentId.role == 0) {
            return <span>无</span>
        } else {
            if(record.agentId.parentId.status == -1) {
                return <span>{record.agentId.parentId.name} (已注销)</span>
            } else {
                return <span>{record.agentId.parentId.name}</span>
            }
        }
    }
}, {
    title: '操作',
    dataIndex: 'status',
    key: 'status',
    filters: [{
        text: '正在编辑',
        value: '-1',
    }, {
        text: '待审核',
        value: '0',
    }, {
        text: '已通过',
        value: '1',
    }, {
        text: '已否决',
        value: '2',
    }, {
        text: '已退回',
        value: '3',
    }],
    filterMultiple: true,
    onFilter: (value, record) => record.status == value,
    sorter: (a, b) => a.status - b.status,
    render: (value, record) => {
        let status;
        let content;
        switch(record.status) {
            case -1:
                status = '正在编辑';
                content = <span style={{color: 'gray'}}>{status}</span>;
                break;
            case 0:
                status = '待审核';    // 已提交
                content = (
                    <a className="ant-dropdown-link">
                        {status}
                    </a>
                );
                break;
            case 1:
                status = '已通过';    // 已通过
                content = <span style={{color: 'green'}}>{status}</span>;
                break;
            case 2:
                status = '已否决';    // 已否决
                content = <span style={{color: 'red'}}>{status}</span>;
                break;
            case 3:
                status = '已退回';    // 已退回
                content = <span style={{color: 'orange'}}>{status}</span>;
                break;
            default:
                status = '状态异常';
        }
        return content;
    }
}];



class ClientBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            infos: []
        }
    }
    
    
    render() {
        if(this.state.loading) {
            return <Spin />;
        }
        
        return (
            <div>
                <div>
                    <SearchInput
                        placeholder="查询客户资料"
                        onSearch={value => {
                            this.fetchClients((infos) => {
                                this.setState({
                                    infos: infos.filter(item => item.title.indexOf(value) >= 0)
                                });
                            });
                        }}
                        style={{ width: 200, marginLeft: 10 }}
                    />
                </div>
                <div style={{marginTop: 20}}>
                    <Table
                        dataSource={this.state.infos} columns={columns}
                    />
                </div>
            </div>
        )
    }
    
    
    componentDidUpdate (prevProps) {
        // 通过参数更新数据
        let oldId = prevProps.params.id;
        let newId = this.props.params.id;
        
        if (newId !== oldId) {
            this.fetchClients();
        }
    }
    
    fetchClients(callback) {
        var status = getUrlId('status');
        var url = !status ? '/apiv1/information/all' : '/apiv1/information/all?status=' + status;
        $.ajax({
            type: 'GET',
            url: url,
            beforeSend: () => {
                this.setState({loading: true});
            },
            success: (res) => {
                if(res.err == 0) {
                    this.setState({loading: false, infos: res.infos});
                    if(callback) {
                        callback(res.infos);
                    }
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
    
    componentWillMount() {
        this.fetchClients();
    }
}

export default ClientBox;