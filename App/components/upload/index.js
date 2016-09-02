/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import { Spin, notification, Button } from 'antd';

import InfoForm from './InfoForm';
import Attachment from './Attachment';
import Message from './Message';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as userActions from '../../action/user';

class UploadBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:     true,
            information: {
                name:    '',
                mobile:  '',
                school:  '',
                qq:      '',
                comment: ''
            }
        }
    }
    
    render() {
        if (this.state.loading) {
            return <Spin />;
        }
    
        var status = '';
        switch(this.state.information.status) {
            case -1:
                status = '正在编辑';
                break;
            case 0:
                status = '待审核';    // 已提交
                break;
            case 1:
                status = '已通过';    // 已通过
                break;
            case 2:
                status = '已否决';    // 已否决
                break;
            case 3:
                status = '已退回';    // 已退回
                break;
            default:
                status = '状态异常';
        }
        
        let {user} = this.props;
        
        let submitButton = this.state.information.status >= 0 ? null:
            <div style={{marginTop: 20, float: 'right'}}>
                <Button type="primary" onClick={this.handlePublish.bind(this)}>发布</Button>
            </div>;
        
        return (
            <div>
                <h2>当前状态: {status}</h2>
                <InfoForm information={this.state.information}/>
                <Attachment information={this.state.information}/>
                {
                    submitButton = this.state.information.status >= 0 ?
                        <Message information={this.state.information} user={user}/> : null
                }
                {
                    sessionStorage.userId.toString() == this.state.information.agentId.toString() ? submitButton : ''
                }
            </div>
        );
    }
    
    componentWillMount() {
        this.fetchData();
    }
    
    fetchData() {
        var id = getUrlId('information');
    
        $.ajax({
            type:    'GET',
            url:     '/apiv1/information/' + id,
            beforeSend: () => {
                this.setState({loading: true})
            },
            success: (res) => {
                if (res.err == 0) {
                    this.setState({information: res.information, loading: false});
                } else {
                    notification.success({
                        message:     'Error',
                        description: res.msg
                    });
                }
            },
            error:   (res) => {
                notification.error({
                    message:     '网络错误',
                    description: '如果该问题重复出现请联系客服人员'
                });
            }
        })
    }
    
    handlePublish() {
        $.ajax({
            type: 'POST',
            url:  '/apiv1/information/update_status',
            data: {
                id: this.state.information._id,
                status: 0
            },
            success: (res) => {
                if (res.err == 0) {
                    notification.success({
                        message: 'Success',
                        description: '发布成功, 等待审核'
                    });
                    this.fetchData();
                } else {
                    console.error(res.msg);
                    notification.error({
                        message: 'Error',
                        description: '操作失败'
                    });
                }
            }
        })
    }
}


function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadBox);