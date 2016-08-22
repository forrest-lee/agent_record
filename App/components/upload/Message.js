/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import { Table, Form, Input, Button, Checkbox, Select, Row, Col, Upload, message, notification } from 'antd';
const FormItem = Form.Item;
const Dragger  = Upload.Dragger;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);

const columns = [{
    title: '提交人',
    dataIndex: 'owner',
    key: 'owner'
}, {
    title: '时间',
    dataIndex: 'updateAt',
    key: 'updateAt'
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
}, {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment'
}];

const dataSource = [{
    owner: '风控1',
    updateAt: '2016-08-11 18:42',
    status: '返回',
    comment: '客户电话无法接通'
}, {
    owner: '人人花1',
    updateAt: '2016-08-11 18:42',
    status: '同意',
    comment: ''
}];

class Message extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount() {
        var id = getUrlId('information');
        $.ajax({
            type: 'GET',
            url: '/apiv1/information/' + id + '/messages',
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        messages: res.messages
                    })
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.msg
                    });
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
        let style = {
            preWrap: cx({
                'preWrap': true
            }),
            borderBox: cx({
                'border-container': true
            })
        };
    
        const commentFormLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        };
        
        return (
            <div>
                <div style={{ marginTop: 36 }}>
                    <h2 style={{marginBottom: 10}}>审核信息记录</h2>
                    <Table dataSource={dataSource} columns={columns} />
                </div>
    
                <div style={{padding: '20px 15px 1px', backgroundColor: '#f7f7f7', borderRadius: 15}}>
                    <h2 style={{marginBottom: 10}}>发布审核信息</h2>
                    <Form horizontal>
                        <FormItem
                            id="select"
                            label="操作"
                            {...commentFormLayout}
                        >
                            <Select
                                id="select" size="large" style={{ width: 200 }}
                                placeholder='请选择'
                            >
                                <Select.Option value="0">通过</Select.Option>
                                <Select.Option value="1">退回</Select.Option>
                                <Select.Option value="2">否决</Select.Option>
                            </Select>
                        </FormItem>
            
                        <FormItem
                            id="control-textarea"
                            label="备注"
                            {...commentFormLayout}
                        >
                            <Input type="textarea" id="control-textarea" rows="3" />
                        </FormItem>
            
                        <FormItem wrapperCol={{ span: 16, offset: 2 }} style={{ marginTop: 0 }}>
                            <Button type="primary">提交</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Message;