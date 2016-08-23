import React from 'react';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as infoActions from '../../action/information';

import { Table, Button, Input, Spin, Menu, Dropdown, Icon, notification } from 'antd';
const InputGroup = Input.Group;


const columns = [{
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <a href={'/#/information/' + record._id}>{text}</a>,
}, {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile'
}, {
    title: '更新时间',
    dataIndex: 'updateAt',
    key: 'updateAt'
}, {
    title: '提交人',
    dataIndex: 'agentName',
    key: 'agentName'
}, {
    title: '操作',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
        let status;
        let menu = (
            <Menu onSelect={(item) => {
                $.ajax({
                    type: 'POST',
                    url:  '/apiv1/information/update_status',
                    data: {
                        id: record._id,
                        status: item.key
                    },
                    success: (res) => {
                        if (res.err == 0) {
                            notification.success({
                                message: 'Success',
                                description: '操作成功'
                            });
                        } else {
                            console.error(res.msg);
                            notification.error({
                                message: 'Error',
                                description: '操作失败'
                            });
                        }
                    }
                })
            }}>
                <Menu.Item key='1'> 通过 </Menu.Item>
                <Menu.Item key='2'> 否决 </Menu.Item>
                <Menu.Item key='3'> 退回 </Menu.Item>
            </Menu>
        );
        let content;
        
        switch(record.status) {
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
    
    handleInputChange(e) {
        this.setState({
            value: e.target.value,
        });
    }
    
    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    }
    
    handleSearch() {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    }
    
}

class ClientBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/client/all',
            success: (res) => {
                if(res.err == 0) {
                    this.props.infoActions.setInfos(res.infos);
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
                    <SearchInput
                        placeholder="查询客户资料"
                        onSearch={value => console.log(value)}
                        style={{ width: 200, marginLeft: 10 }}
                    />
                </div>
                <div style={{marginTop: 20}}>
                    <Table
                        dataSource={this.props.infos} columns={columns}
                    />
                </div>
            </div>
        )
    }
    
    
    rowClick = (record, index) => {
        window.location.hash = '/information/' + record._id;
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