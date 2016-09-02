/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import dateformat from 'dateformat';
import { Spin, Form, Input, Button, Checkbox, Row, Col, notification } from 'antd';

class NotificationDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    
    componentWillMount() {
        var id = getUrlId('notification');
        
        $.ajax({
            type: 'GET',
            url:  '/apiv1/notification/' + id,
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        notification: res.notification,
                        loading: false
                    })
                }
            },
            error: (res) => {
                notification.error({
                    message: '网络错误',
                    description: res.msg
                });
            }
        })
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />;
        }
        console.log(this.state.notification.ownerId._id);
        console.log(sessionStorage.userId);
        
        return (
            <div>
                <Button type="default" onClick={this.back} icon="rollback">返回</Button>
                
                <h1>{this.state.notification.title}</h1>
                <span>作者: {this.state.notification.ownerId.name}</span>
                <span style={{marginLeft: 20}}>更新时间: {dateformat(this.state.notification.updateAt, 'yyyy-mm-dd HH:MM:ss')}</span>
                <div style={{marginTop: 15, whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {this.state.notification.content}
                </div>
    
                {
                    this.state.notification.ownerId._id.toString() == sessionStorage.userId.toString() || sessionStorage.userRole == 0 ?
                        <Button
                            icon="delete"
                            style={{
                                height: 36,
                                backgroundColor: '#EB5768',
                                color: '#fff',
                                float: 'right',
                                marginTop: 22,
                                marginRight: 22
                            }}
                            onClick={this.handleDelete.bind(this)}
                        >
                            删除公告
                        </Button> : null
                }
            </div>
        );
    }
    
    
    handleDelete = () => {
        $.ajax({
            type: 'POST',
            url: '/apiv1/notification/delete',
            data: {
                id: getUrlId('notification')
            },
            success: (res) => {
                if(res.err == 0) {
                    notification.success({
                        message: 'Success',
                        description: res.msg
                    });
                    window.location.hash = '/notification/all';
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.msg
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        })
    };
    
    back = () => {
        history.back();
    }
}

export default NotificationDetail;