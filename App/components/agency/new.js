import React from 'react';
import classNames from 'classnames';
import { Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Select, notification } from 'antd';
const FormItem   = Form.Item;
const RadioGroup = Radio.Group;


class NewClient extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
        
        const formItemLayout = {
            labelCol:   {span: 7},
            wrapperCol: {span: 12},
        };
        
        const usernameProps = getFieldProps('username', {
            rules:   [
                {required: true, min: 5, message: '用户名至少为 5 个字符'},
                {validator: this.userExists},
            ],
        });
        
        const nameProps = getFieldProps('name', {
            rules:   [
                {required: true, min: 2, message: '姓名名至少为 2 个字符'},
            ],
        });
        
        const genderProps = getFieldProps('gender', {
            rules:   [
                {type: 'number', required: true}
            ],
        });
        
        const mobileProps = getFieldProps('mobile', {
            rules: [
                {required: true, len: 11, message: '手机号必须为11位'},
            ],
        });
        
        return (
            <div>
                <h2>新增代理</h2>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        label='帐号'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('username') ? '校验中...' : (getFieldError('username') || []).join(', ')}
                    >
                        <Input {...usernameProps} id='username' placeholder='请输入帐号'/>
                    </FormItem>
    
                    <FormItem
                        label='真实姓名'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                    >
                        <Input {...nameProps} id='name' placeholder='请输入真实姓名'/>
                    </FormItem>
    
                    <FormItem
                        label='手机号'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('mobile') ? '校验中...' : (getFieldError('mobile') || []).join(', ')}
                    >
                        <Input {...mobileProps} id='mobile' placeholder='手机号'/>
                    </FormItem>
                    
                    
                    <FormItem
                        label='性别'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('gender') ? '校验中...' : (getFieldError('gender') || []).join(', ')}
                    >
                        <RadioGroup {...genderProps}>
                            <Radio value={0}>男</Radio>
                            <Radio value={1}>女</Radio>
                        </RadioGroup>
                    </FormItem>
                    
                    <FormItem
                        label='QQ号'
                        {...formItemLayout}
                    >
                        <Input {...getFieldProps('qq')} id='qq' placeholder='请输入QQ号' />
                    </FormItem>
                    
                    <FormItem
                        label='备注'
                        {...formItemLayout}
                    >
                        <Input {...getFieldProps('comment')} type='textarea' id='comment' rows='3'/>
                    </FormItem>
                    
                    
                    <FormItem wrapperCol={{span: 12, offset: 7}} style={{marginTop: 24}}>
                        <Button type='primary' size='large' htmlType='submit'>提交</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
    
    userExists = (rule, value, callback) => {
        if (!value) {
            callback();
        } else {
            $.ajax({
                type: 'POST',
                url: '/apiv1/user/exists',
                data: {
                    username: value
                },
                success: (res) => {
                    if(res.err == 2) {
                        callback([new Error('抱歉，该用户名已被占用。')]);
                    } else {
                        callback();
                    }
                }
            });
        }
    };
    
    
    handleSubmit(e) {
        e.preventDefault();
        //console.log('收到表单值：', this.props.form.getFieldsValue());
        
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                console.error(errors);
                return;
            }
            
            $.ajax({
                type:    'POST',
                url:     '/apiv1/user/add',
                data:    {
                    username: values.username,
                    name:     values.name,
                    gender:   values.gender,
                    mobile:   values.mobile,
                    qq:       values.qq,
                    comment:  values.comment
                },
                success: function (res) {
                    if(res.err == 0) {
                        notification.success({
                            message:     'Success',
                            description: res.msg
                        });
                        window.location.hash = 'agency/all';
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

NewClient = Form.create()(NewClient);

export default NewClient;