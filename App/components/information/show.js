import React from 'react';
import dateformat from 'dateformat';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as infoActions from '../../action/information';

import { Table, Button, Input, Spin, Menu, Dropdown, Icon, notification } from 'antd';
const InputGroup = Input.Group;


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
        return <span>{r.agentId.name}</span>
    }
}, {
    title: '代理级别',
    dataIndex: 'role',
    key: 'role',
    render: (v, r) => {
        var roleType = '';
        switch(r.agentId.role) {
            case 0: roleType='管理员'; break;
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
        return <span>{record.agentId.role == 0 ? '无' : record.agentId.parentId.name}</span>
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
        let menu = (
            <Menu onSelect={(item) => {
                $.ajax({
                    type: 'POST',
                    url: '/apiv1/information/new_message',
                    data: {
                        id: record._id,
                        status: item.key,
                        content: '',
                    },
                    success: (res) => {
                        if(res.err == 0) {
                            notification.success({
                                message: 'Success',
                                description: res.msg
                            });
                            //window.location.hash = '/client/all';
                            this.props.history.pushState(null, '/client/all');
                        } else {
                            console.error(res.msg);
                            notification.error({
                                message: 'Error',
                                description: '操作失败'
                            });
                        }
                    }
                });
            }}>
                <Menu.Item key='1'> 通过 </Menu.Item>
                <Menu.Item key='2'> 否决 </Menu.Item>
                <Menu.Item key='3'> 退回 </Menu.Item>
            </Menu>
        );
        let content;
        
        switch(record.status) {
            case -1:
                status = '正在编辑';
                menu = <div></div>;
                content = <span style={{color: 'gray'}}>{status}</span>;
                break;
            case 0:
                status = '待审核';    // 已提交
                content = (
                    <a className="ant-dropdown-link">
                        {status} <Icon type="down" />
                    </a>
                );
                break;
            case 1:
                status = '已通过';    // 已通过
                menu = <div></div>;
                content = <span style={{color: 'green'}}>{status}</span>;
                break;
            case 2:
                status = '已否决';    // 已否决
                menu = <div></div>;
                content = <span style={{color: 'red'}}>{status}</span>;
                break;
            case 3:
                status = '已退回';    // 已退回
                menu = <div></div>;
                content = <span style={{color: 'orange'}}>{status}</span>;
                break;
            default:
                status = '状态异常';
        }
        
        return (
            <span>
                <Dropdown overlay={menu} trigger={['click']}>
                    {content}
                </Dropdown>
            </span>
        )
    }
}
];


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

class ClientBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            infos: this.props.infos
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
                            this.setState({
                                infos: this.state.infos.filter(item => item.title.indexOf(value) >= 0)
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
    
    
    rowClick = (record, index) => {
        window.location.hash = '/information/' + record._id;
    };
    
    
    componentDidUpdate (prevProps) {
        // 通过参数更新数据
        let oldId = prevProps.params.id;
        let newId = this.props.params.id;
        
        if (newId !== oldId) {
            this.fetchClients();
        }
    }
    
    fetchClients() {
        var status = getUrlId('status');
        var url = !status ? '/apiv1/information/all' : '/apiv1/information/all?status=' + status;
        $.ajax({
            type: 'GET',
            url: url,
            beforeSend: () => {
                this.setState({loading: true});
            },
            success: (res) => {
                console.log(res);
                if(res.err == 0) {
                    this.props.infoActions.setInfos(res.infos);
                    this.setState({loading: false, infos: this.props.infos});
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

function mapStateToProps(state) {
    return {
        user: state.user,
        infos: state.infos
    }
}

function mapDispatchToProps(dispatch) {
    return {
        infoActions: bindActionCreators(infoActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClientBox);