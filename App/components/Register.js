/**
 * Created by leo on 8/15/16.
 */
import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
const FormItem = Form.Item;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);

function noop() {
    return false;
}

class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

        let styles = {
            loginContainer: cx({
                loginContainer: true
            })
        };

        const nameProps = getFieldProps('name', {
            rules: [
                { required: true, min: 5, message: '用户名至少为 5 个字符' },
                { validator: this.userExists },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const emailProps = getFieldProps('email', {
            validate: [{
                rules: [
                    { required: true },
                ],
            }, {
                rules: [
                    { type: 'email', message: '请输入正确的邮箱地址' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        const passwdProps = getFieldProps('passwd', {
            rules: [
                { required: true, whitespace: true, message: '请填写密码' },
                { validator: this.checkPass },
            ],
        });
        const rePasswdProps = getFieldProps('rePasswd', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请再次输入密码',
            }, {
                validator: this.checkPass2,
            }],
        });
        const textareaProps = getFieldProps('textarea', {
            rules: [
                { required: false, message: '' },
            ],
        });
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        };

        return (
            <div>
                <div className={styles.loginContainer}>
                    <div style={{textAlign: 'center'}}>
                        <h1>用户注册</h1>
                    </div>

                    <div style={{marginTop: 20}}>
                        <Form horizontal>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                                hasFeedback
                                help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                            >
                                <Input {...nameProps} placeholder="帐号/用户名" />
                            </FormItem>

                            {/*<FormItem
                                {...formItemLayout}
                                label="手机号"
                                hasFeedback
                            >
                                <Input {...emailProps} type="mobile" placeholder='请输入手机号' />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="邮箱"
                                hasFeedback
                            >
                                <Input {...emailProps} type="email" placeholder='请输入电子邮箱帐号' />
                            </FormItem>*/}

                            <FormItem
                                {...formItemLayout}
                                label="密码"
                                hasFeedback
                            >
                                <Input {...passwdProps} type="password" autoComplete="off"
                                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="确认密码"
                                hasFeedback
                            >
                                <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
                                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="备注"
                            >
                                <Input {...textareaProps} type="textarea" placeholder="随便写" id="textarea" name="textarea" />
                            </FormItem>

                            <FormItem wrapperCol={{ span: 12, offset: 7 }}>
                                <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 重置所有表单
     * @param e
     */
    handleReset(e) {
        e.preventDefault();
        //Register.resetFields();
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log('Submit!!!');
            console.log(values);
        });
    }

    userExists = (rule, value, callback) => {
        if (!value) {
            callback();
        } else {
            setTimeout(() => {
                if (value === 'JasonWood') {
                    callback([new Error('抱歉，该用户名已被占用。')]);
                } else {
                    callback();
                }
            }, 800);
        }
    };

    checkPass = (rule, value, callback) => {
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(['rePasswd'], { force: true });
        }
        callback();
    };

    checkPass2 = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('passwd')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    };
}

Register = Form.create()(Register);

export default Register;