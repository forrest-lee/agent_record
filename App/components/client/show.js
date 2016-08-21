import React from 'react';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as infoActions from '../../action/information';

import { Table, Button, Input, Spin } from 'antd';
const InputGroup = Input.Group;

const columns = [{
    title: '标题',
    dataIndex: 'title',
    key: 'title'
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
    title: '状态',
    dataIndex: 'status',
    key: 'status'
}];

const dataSource = [{
    type: '签约合同上传',
    title: '魏磊-武汉生物工程学院',
    mobile: '12345678901',
    updateAt: '2016-08-11 18:42',
    owner: '人人花1',
    status: '已完成'
}, {
    type: '借款资料上传审批',
    title: '黄紫迎-武昌职业学院',
    mobile: '21345678902',
    updateAt: '2016-08-11 15:19',
    owner: '人人花1',
    status: '待审核'
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
                        onRowClick={this.rowClick}
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