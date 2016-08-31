/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import dateformat from 'dateformat';
import { Table, Form, Input, Button, Checkbox, Select, Row, Col, Upload, message, notification } from 'antd';
const FormItem = Form.Item;
const Dragger  = Upload.Dragger;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);

const columns = [{
    title: '提交人',
    dataIndex: 'ownerName',
    key: 'ownerName'
}, {
    title:     '时间',
    dataIndex: 'updateAt',
    key:       'updateAt',
    render:    (value, record) => <span>{dateformat(value, 'yyyy-mm-dd HH:MM:ss')}</span>
}, {
    title: '意见',
    dataIndex: 'status',
    key: 'status',
    render: (value, record) => {
        let status = '';
        switch(value) {
            case 1:
                status = '通过';
                break;
            case 2:
                status = '否决';
                break;
            case 3:
                status = '退回';
                break;
            default:
                status = '异常';
        }
        return <span>{status}</span>;
    }
}, {
    title: '备注',
    dataIndex: 'content',
    key: 'content'
}];


class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            messages: []
        }
    }
    
    componentWillMount() {
        var id = getUrlId('information');
        $.ajax({
            type: 'GET',
            url: '/apiv1/information/' + id + '/messages',
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        loading: false,
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
        const {getFieldProps} = this.props.form;
        
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
        
        var status = this.props.information.status;
        var editable = status == -1 || status == 3;
        
        if(status == -1 || status == 1 || status == 2) {
            return <div></div>
        }
        
        return (
            <div>
                <div style={{ marginTop: 36 }}>
                    <h2 style={{marginBottom: 10}}>审核信息记录</h2>
                    <Table dataSource={this.state.messages} columns={columns} />
                </div>
    
                {
                    sessionStorage.userRole != 0 ? '' :
                        <div style={{padding: '20px 15px 1px', backgroundColor: '#f7f7f7', borderRadius: 15}}>
                            <h2 style={{marginBottom: 10}}>发布审核信息</h2>
                            <Form horizontal>
                                <FormItem
                                    id="select"
                                    label="操作"
                                    {...commentFormLayout}
                                >
                                    <Select
                                        id="status" size="large" style={{ width: 200 }}
                                        placeholder='请选择'
                                        {...getFieldProps('status', {rules: [{ required: true, message: '请选择' }]})}
                                    >
                                        <Select.Option value="1">通过</Select.Option>
                                        <Select.Option value="2">否决</Select.Option>
                                        <Select.Option value="3">退回</Select.Option>
                                    </Select>
                                </FormItem>
            
                                <FormItem
                                    id="control-textarea"
                                    label="备注"
                                    {...commentFormLayout}
                                >
                                    <Input
                                        type="textarea" id="content" rows="3"
                                        {...getFieldProps('content', {rules: [{ required: true, message: '请填写' }]})}
                                    />
                                </FormItem>
            
                                <FormItem wrapperCol={{ span: 16, offset: 2 }} style={{ marginTop: 0 }}>
                                    <Button type="primary" onClick={this.submitMsg}>提交</Button>
                                </FormItem>
                            </Form>
                        </div>
                }
            </div>
        );
    }
    
    submitMsg = () => {
        let id = getUrlId('information');
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
    
            $.ajax({
                type: 'POST',
                url: '/apiv1/information/new_message',
                data: {
                    id: id,
                    status: values.status,
                    content: values.content,
                },
                success: (res) => {
                    if(res.err == 0) {
                        notification.success({
                            message: 'Success',
                            description: res.msg
                        });
                        //window.location.hash = '/client/all';
                        this.props.history.pushState(null, '/client/all');
                    }
                }
            })
        });
    };
}


Message = Form.create()(Message);

export default Message;