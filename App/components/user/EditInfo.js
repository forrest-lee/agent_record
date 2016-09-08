/**
 * Created by leo on 9/7/16.
 */
import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, notification, Spin, Select, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditInfo extends React.Component {
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
    
        const nameProps = getFieldProps('name', {
            rules:   [
                {required: true, min: 2, message: '姓名名至少为 2 个字符'},
            ],
            initialValue: this.state.user.name
        });
    
        const mobileProps = getFieldProps('mobile', {
            rules: [
                {required: true, len: 11, message: '手机号必须为11位'},
            ],
            initialValue: this.state.user.mobile
        });
        
        const qqProps = getFieldProps('qq', {
            initialValue: this.state.user.qq
        });
        
        const commentProps = getFieldProps('comment', {
            initialValue: this.state.user.comment
        });
        
        return (
            <div style={{marginTop: 40}}>
                <Button type="default" onClick={() => {history.back()}} icon="rollback">返回</Button>
                <Form horizontal>
                    <FormItem
                        label='真实姓名'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                    >
                        <Input
                            {...nameProps}
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
                            {...mobileProps}
                            defaultValue={this.state.user.mobile}
                            placeholder="手机号"
                        />
                    </FormItem>
    
                    <FormItem
                        label='性别'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('gender') ? '校验中...' : (getFieldError('gender') || []).join(', ')}
                    >
                        <RadioGroup
                            {...getFieldProps('gender', { initialValue: this.state.user.gender.toString() })}
                        >
                            <Radio value="0">男</Radio>
                            <Radio value="1">女</Radio>
                        </RadioGroup>
                    </FormItem>
                    
                    <FormItem
                        label='QQ号'
                        {...formItemLayout}
                    >
                        <Input
                            {...qqProps}
                            defaultValue={this.state.user.qq}
                            placeholder='请输入QQ号'
                        />
                    </FormItem>
                    
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        <Input
                            {...commentProps}
                            defaultValue={this.state.user.comment}
                            type="textarea"
                            name="comment"/>
                    </FormItem>
                </Form>
    
                <Button
                    icon="delete"
                    style={{
                        height: 36,
                        backgroundColor: '#EB5768',
                        color: '#fff',
                        float: 'right',
                        marginTop: 22,
                        marginRight: 22
                    }}
                    onClick={this._handleSubmit.bind(this)}
                >
                    确认修改
                </Button>
            </div>
        )
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/' + sessionStorage.userId,
            success: (res) => {
                if(res.err == 0) {
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
    
    _handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
    
            $.ajax({
                type: 'POST',
                url: '/apiv1/user/update_info',
                data: {
                    name: values.name,
                    mobile: values.mobile,
                    gender: values.gender,
                    qq: values.qq,
                    comment: values.comment
                },
                success: (res) => {
                    if (res.err == 0) {
                        notification.success({
                            message:     'Success',
                            description: res.msg
                        });
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
}

EditInfo = Form.create()(EditInfo);
export default EditInfo;