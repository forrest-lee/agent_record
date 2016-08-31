/**
 * Created by leo on 8/10/16.
 */
import React from 'react';
import { bindActionCreators, createStore, combineReducers, applyMiddleware } from 'redux';
import { connect } from 'react-redux';

import { Form, Input, Button, Checkbox, Row, Col, notification } from 'antd';


const FormItem = Form.Item;

import classNames from 'classnames';
import styles from '../styles.scss';
let cx = classNames.bind(styles);


import * as userActions from '../../action/user';


class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {getFieldProps} = this.props.form;

        let styles = {
            loginContainer: cx({
                loginContainer: true
            })
        };
        
        return (
            <div>
                <div className={styles.loginContainer}>
                    <div style={{textAlign: 'center'}}>
                        <h1>优贷录件系统</h1>
                    </div>

                    <div style={{marginTop: 20}}>
                        <Form horizontal>
                            <FormItem
                                label="账户"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <Input placeholder="请输入账户名"
                                       {...getFieldProps('username', {
                                           rules:   [
                                               {required: true, min: 5, message: '帐号至少为5个字符'},
                                           ],
                                       })}
                                />
                            </FormItem>
                            <FormItem
                                label="密码"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <Input type="password" placeholder="请输入密码"
                                       {...getFieldProps('password', {
                                           rules:   [
                                               {required: true, message: '请输入密码'},
                                           ],
                                       })}
                                />
                            </FormItem>
    
                            <FormItem
                                label="验证码"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <Input type="captcha" placeholder="请输入验证码"
                                       {...getFieldProps('captcha', {
                                           rules:   [
                                               {required: true, len: 4, message: '验证码长度为4位'},
                                           ],
                                       })}
                                       style={{width: '45%'}}
                                />
    
                                <img style={{marginLeft: 15, width: 70}}
                                     src="/user/captcha" alt="captcha"
                                     ref='captcha'
                                     onClick={this.refreshCode}
                                />
    
                                <a style={{marginLeft: 15}} onClick={this.refreshCode}>换一张</a>
                            </FormItem>
                            
                            <Row>
                                <Col span={10}>
                                    <FormItem style={{marginLeft: 18}}>
                                        <Checkbox {...getFieldProps('agreement')}>记住密码</Checkbox>
                                    </FormItem>
                                </Col>

                                <Col span={14}>
                                    <Button
                                        type="primary"
                                        style={{float: 'right'}}
                                        onClick={this.handleSubmit.bind(this)}
                                    >
                                        登录
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
    
    refreshCode = () => {
        this.refs.captcha.src = this.refs.captcha.src + "?code=" + Math.random();
    };


    handleSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            
            $.ajax({
                type: 'POST',
                url:  '/user/login',
                data: {
                    username: values.username,
                    password: values.password,
                    captcha:  values.captcha
                },
                success: (res) => {
                    if (res.err == 0) {
                        sessionStorage.userId = res.user._id;
                        sessionStorage.username = res.user.username;
                        sessionStorage.nameStr = res.user.name;
                        sessionStorage.userRole = res.user.role;
                        
                        this.props.userActions.login(res.user);
                        
                        notification.success({
                            message: 'Success',
                            description: res.msg
                        });
                        
                        window.location.hash = 'notification/all';
                    } else {
                        notification.error({
                            message: 'Error',
                            description: res.msg
                        });
                        this.refreshCode();
                    }
                },
                error: function (err) {
                    notification.error({
                        message: '网络错误',
                        description: '如果该问题重复出现请联系客服人员'
                    });
                }
            })
        });
    };

}

Login = Form.create()(Login);


function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);