/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
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
        
        return (
            <div>
                <h1>{this.state.notification.title}</h1>
                <div style={{marginTop: 15, whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {this.state.notification.content}
                </div>
            </div>
        );
    }
}

export default NotificationDetail;