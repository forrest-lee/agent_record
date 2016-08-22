/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import { Table, Form, Input, Button, Checkbox, Select, Row, Col, Upload, message, notification } from 'antd';
const FormItem = Form.Item;


class NewNotification extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
        
        const commentFormLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        };
    
        const titleProps = getFieldProps('title', {
            rules:   [
                {required: true, message: '请输入公告标题'},
            ]
        });
    
        const contentProps = getFieldProps('content', {
            rules:   [
                {required: true, message: '请输入公告内容'},
            ]
        });
        
        return (
            <div>
                <div style={{padding: '20px 15px 1px', backgroundColor: '#f7f7f7', borderRadius: 15}}>
                    <h2 style={{marginBottom: 10}}>发布系统公告</h2>
                    <Form horizontal>
                        <FormItem
                            label="标题"
                            {...commentFormLayout}
                            hasFeedback
                            help={isFieldValidating('title') ? '校验中...' : (getFieldError('title') || []).join(', ')}
                        >
                            <Input {...titleProps} placeholder="公告标题" />
                        </FormItem>
            
                        <FormItem
                            label="内容"
                            {...commentFormLayout}
                            hasFeedback
                        >
                            <Input {...contentProps} type="textarea" rows="10" />
                        </FormItem>
            
                        <FormItem wrapperCol={{ span: 16, offset: 2 }} style={{ marginTop: 0 }}>
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>发布</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
    
    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
        
            $.ajax({
                type:    'POST',
                url:     '/apiv1/notification/new',
                data:    {
                    title: values.title,
                    content: values.content
                },
                success: function (res) {
                    if(res.err == 0) {
                        notification.success({
                            message:     'Success',
                            description: res.msg
                        });
                        window.location.hash = 'notification/all';
                    } else {
                        notification.error({
                            message:     'Error',
                            description: res.msg
                        });
                    }
                },
                error:   function (err) {
                    notification.error({
                        message:     'Error',
                        description: res.msg
                    });
                }
            });
        });
    }
}

NewNotification = Form.create()(NewNotification);

export default NewNotification;