/**
 * Created by leo on 9/1/16.
 */
/**
 * Created by leo on 9/1/16.
 */
import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, notification, Spin, Select, Radio } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />
        }
        
        const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
        const formItemLayout = {
            labelCol:   {span: 7},
            wrapperCol: {span: 12},
        };
    
        const passwdProps    = getFieldProps('password', {
            rules: [
                {required: true, whitespace: true, message: '请填写密码'},
                {validator: this.checkPass},
            ],
        });
        const rePasswdProps  = getFieldProps('repassword', {
            rules: [{
                required:   true,
                whitespace: true,
                message:    '请再次输入密码',
            }, {
                validator: this.checkPass2,
            }],
        });
        
        
        return (
            <div style={{marginTop: 40}}>
                <Button type="default" onClick={() => {history.back()}} icon="rollback">返回</Button>
                <Form horizontal>
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                        hasFeedback
                        help={isFieldValidating('username') ? '校验中...' : (getFieldError('username') || []).join(', ')}
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.username}
                            placeholder="帐号/用户名"
                        />
                    </FormItem>
    
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                        hasFeedback
                    >
                        <Input
                            {...passwdProps} type="password" autoComplete="off"
                        />
                    </FormItem>
    
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                        hasFeedback
                    >
                        <Input
                            {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
                        />
                    </FormItem>
    
                    <FormItem wrapperCol={{span: 12, offset: 7}}>
                        <Button type="primary" onClick={this.handleSubmit.bind(this)}>修改密码</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/' + sessionStorage.userId,
            success: (res) => {
                if(res.err == 0) {
                    console.log(res.user);
                    this.setState({user: res.user, loading: false});
                } else {
                    notification.error({
                        message:     'Error',
                        description: res.msg
                    });
                }
            }, error: (res) => {
                console.error(res);
            }
        })
    }
    
    checkPass = (rule, value, callback) => {
        const {validateFields} = this.props.form;
        if (value) {
            validateFields(['repassword'], {force: true});
        }
        callback();
    };
    
    checkPass2 = (rule, value, callback) => {
        const {getFieldValue} = this.props.form;
        if (value && value !== getFieldValue('password')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    };
    
    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
    
            $.ajax({
                type: 'POST',
                url: '/apiv1/user/reset_password',
                data: {
                    password: values.password,
                    repassword: values.repassword
                },
                success: (res) => {
                    if (res.err == 0) {
                        notification.success({
                            message:     'Success',
                            description: res.msg
                        });
                        
                        this.logout();
                        
                    } else {
                        notification.error({
                            message:     'Error',
                            description: res.msg
                        });
                    }
                },
                error: (res) => {
                    console.error(res.msg);
                }
            })
        })
    }
    
    logout() {
        $.ajax({
            type: 'POST',
            url: '/user/logout',
            success: function (res) {
                if (res.err == 0) {
                    sessionStorage.userId = '';
                    sessionStorage.userRole = '';
                    sessionStorage.username = '';
                    
                    window.location.hash = 'login';
                }
            },
            error: function (err) {
            }
        })
    }
}

Setting = Form.create()(Setting);
export default Setting;