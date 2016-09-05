/**
 * Created by leo on 8/15/16.
 */
import React from 'react';
import dateformat from 'dateformat';
import classNames from 'classnames';
import { Table, Button, Input, Spin, Icon, notification } from 'antd';
const InputGroup = Input.Group;

const columns = [{
    title: '公告标题',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <a href={'/#/notification/' + record._id}>{text}</a>
}, {
    title: '发布时间',
    dataIndex: 'updateAt',
    key: 'updateAt',
    render: (text, record) => <span>{dateformat(text, 'yyyy-mm-dd HH:MM:ss')}</span>
}, {
    title:     '发布人',
    dataIndex: 'owner',
    key:       'owner',
    render:    (v, r) => {
        if(r.ownerId.status == -1) {
            return <span>{r.ownerId.name} (已注销)</span>;
        } else {
            return <span>{r.ownerId.name}({v})</span>;
        }
    }
}
];


export default class NotificationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />;
        }
        
        return (
            <div>
                <Button type="primary" onClick={this.newNotification}>
                    写公告<Icon type="edit" />
                </Button>
                
                <div style={{marginTop: 20}}>
                    <Table
                        dataSource={this.state.notifications} columns={columns}
                    />
                </div>
            </div>
        )
    }
    
    componentWillMount() {
        this.fetchData();
    }
    
    componentDidUpdate (prevProps) {
        // 通过参数更新数据
        let oldPath = prevProps.route.path;
        let newPath = this.props.route.path;
        
        if (newPath !== oldPath) {
            this.fetchData();
        }
    }
    
    fetchData = () => {
        if(window.location.hash.indexOf('/notification/all') > 0) {
            this.fetchAll();
        } else {
            this.fetchMine();
        }
    };
    
    fetchAll = () => {
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
                    //console.log(res.msg);
                }
            },
            error: (res) => {
                notification.error({
                    message: 'Error',
                    description: res.msg
                });
            }
        })
    };
    
    
    fetchMine = () => {
        $.ajax({
            type: 'GET',
            url:  '/apiv1/notification/mine',
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        notifications: res.notifications,
                        loading: false
                    });
                } else {
                    //console.log(res.msg);
                }
            },
            error: (res) => {
                notification.error({
                    message: 'Error',
                    description: res.msg
                });
            }
        })
    };
    
    newNotification = () => {
        window.location.hash = 'notification/new';
    };
    
    handleRowClick = (record, index) => {
        window.location.hash = '/notification/' + record._id;
    }
}
