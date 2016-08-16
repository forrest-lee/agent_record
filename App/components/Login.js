/**
 * Created by leo on 8/10/16.
 */
import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
const FormItem = Form.Item;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);

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
                        <h1>小微学贷</h1>
                    </div>
                    
                    <div style={{marginTop: 20}}>
                        <Form horizontal onSubmit={this.handleSubmit}>
                            <FormItem
                                label="账户"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <Input placeholder="请输入账户名"
                                       {...getFieldProps('userName')}
                                />
                            </FormItem>
                            <FormItem
                                label="密码"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <Input type="password" placeholder="请输入密码"
                                       {...getFieldProps('password')}
                                />
                            </FormItem>
                            
                            <Row>
                                <Col span={10}>
                                    <FormItem style={{marginLeft: 18}}>
                                        <Checkbox {...getFieldProps('agreement')}>记住密码</Checkbox>
                                    </FormItem>
                                </Col>
                                
                                <Col span={14}>
                                    <Button type="primary" htmlType="submit" style={{float: 'right'}}>登录</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
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
            console.log('Submit!!!');
            console.log(values);
        });
    }
}

Login = Form.create()(Login);

export default Login;