/**
 * Created by leo on 9/1/16.
 */
import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, notification, Spin, Select, Radio } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class UserDetail extends React.Component {
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
                        label='真实姓名'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.name}
                            placeholder='请输入真实姓名'
                        />
                    </FormItem>
        
                    <FormItem
                        {...formItemLayout}
                        label="手机号"
                        hasFeedback
                        help={isFieldValidating('mobile') ? '校验中...' : (getFieldError('mobile') || []).join(', ')}
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.mobile}
                            placeholder="手机号"
                        />
                    </FormItem>
    
                    <FormItem
                        label='代理类型'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('role') ? '校验中...' : (getFieldError('role') || []).join(', ')}
                    >
                        <Select
                            disabled
                            defaultValue={this.state.user.role}
                            placeholder='请选择代理类型'
                        >
                            <Select.Option value={0} diabled>管理员</Select.Option>
                            <Select.Option value={1}>一级代理</Select.Option>
                            <Select.Option value={2}>二级代理</Select.Option>
                            <Select.Option value={3}>三级代理</Select.Option>
                        </Select>
                    </FormItem>
    
                    <FormItem
                        label='父级代理'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('parent') ? '校验中...' : (getFieldError('parent') || []).join(', ')}
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.parent}
                            id='parent' placeholder='请输入父级代理帐号'
                        />
                    </FormItem>
    
                    <FormItem
                        label='性别'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('gender') ? '校验中...' : (getFieldError('gender') || []).join(', ')}
                    >
                        <RadioGroup
                            disabled
                            defaultValue={this.state.user.gender}
                        >
                            <Radio value={0}>男</Radio>
                            <Radio value={1}>女</Radio>
                        </RadioGroup>
                    </FormItem>
    
                    <FormItem
                        label='QQ号'
                        {...formItemLayout}
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.qq}
                            placeholder='请输入QQ号'
                        />
                    </FormItem>
        
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.comment}
                            type="textarea"
                            name="comment"/>
                    </FormItem>
                </Form>
            </div>
        )
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/' + getUrlId('user'),
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
}

UserDetail = Form.create()(UserDetail);
export default UserDetail;