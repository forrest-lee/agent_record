/**
 * Created by leo on 8/15/16.
 */
import React from 'react';
import classNames from 'classnames';
import { Table, Button, Input, Spin, notification } from 'antd';
const InputGroup = Input.Group;

const columns = [{
    title: '公告标题',
    dataIndex: 'title',
    key: 'title'
}, {
    title: '发布时间',
    dataIndex: 'updateAt',
    key: 'updateAt'
}, {
    title: '发布人',
    dataIndex: 'owner',
    key: 'owner'
}];

const dataSource = [{
    title: '全体请注意',
    updateAt: '2016-08-11 18:42',
    owner: '人人花1',
}, {
    title: '新手须知',
    updateAt: '2016-08-11 15:19',
    owner: '人人花1'
}];

export default class NotificationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url:  '/apiv1/notification/all',
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        notifications: res.notifications,
                        loading: false
                    });
                } else {
                    console.log(res.msg);
                }
            },
            error: (res) => {
                notification.error({
                    message: 'Error',
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
                <Button type="primary" onClick={this.newNotification.bind(this)}>发布</Button>
                
                <div style={{marginTop: 20}}>
                    <Table dataSource={this.state.notifications} columns={columns} />
                </div>
            </div>
        )
    }
    
    newNotification() {
        window.location.hash = 'notification/new';
    }
    
}