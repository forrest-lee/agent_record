/**
 * Created by leo on 8/15/16.
 */
import React from 'react';
import { Table, Form, Input, Button, Checkbox, Select, Row, Col, Upload, Icon, message, notification } from 'antd';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);


class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type:    window.location.hash.indexOf('/information') > 0 ? 0 : 1,
            information: {
                status:  !this.props.information ? -1 : !this.props.information.status,
                name:    !this.props.information ? '' : this.props.information.name,
                mobile:  !this.props.information ? '' : this.props.information.mobile,
                school:  !this.props.information ? '' : this.props.information.school,
                qq:      !this.props.information ? '' : this.props.information.qq,
                comment: !this.props.information ? '' : this.props.information.comment,
            }
        }
    }

    render() {
        const { getFieldProps } = this.props.form;

        let style = {
            preWrap: cx({
                'preWrap': true
            }),
            borderBox: cx({
                'border-container': true
            })
        };

        const infoFormLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
    
        var status = this.state.information.status;
        var editable = status == -1 || status == 3;

        const nameProps = getFieldProps('name', {
            rules: [
                {required: true, message: '请填写客户姓名(至少两个字)'},
            ],
            initialValue: this.state.information.name
        });
        const mobileProps = getFieldProps('mobile', {
            rules: [
                {required: true, len: 11, message: '手机号必须为11位'},
            ],
            initialValue: this.state.information.mobile
        });
        const qqProps = getFieldProps('qq', {
            rules: [
                {required: false, message: '请填写QQ号'},
            ],
            initialValue: this.state.information.qq
        });
        const schoolProps = getFieldProps('school', {
            rules: [
                {required: true, message: '请填写学校名称'}
            ],
            initialValue: this.state.information.school
        });
        
        
        let type = this.state.type;

        return (
            <div>
                {
                    window.location.hash.indexOf('/upload/') == -1 ? '' :
                        <h1>新建: {type == 0 ? '资料上传' : '合同上传'}</h1>
                }
                <div style={{ marginTop: 10 }}>
                    <Form horizontal>
                        <Row gutter={10}>
                            <Col sm={12}>
                                <FormItem
                                    {...infoFormLayout}
                                    label="姓名"
                                    hasFeedback
                                >
                                    {
                                        !editable ? <span>{this.state.information.name}</span> :
                                            <Input
                                                placeholder="姓名"
                                                {...nameProps}
                                            />
                                    }
                                </FormItem>
                                <FormItem
                                    {...infoFormLayout}
                                    label="学校"
                                    hasFeedback
                                >
                                    {
                                        !editable ? <span>{this.state.information.school}</span> :
                                            <Input
                                                placeholder="学校"
                                                {...schoolProps}
                                            />
                                    }
                                </FormItem>
                                <FormItem
                                    {...infoFormLayout}
                                    label="备注"
                                    hasFeedback
                                >
                                    {
                                        !editable ? <span>{this.state.information.comment}</span> :
                                            <Input
                                                placeholder="备注"
                                                defaultValue={this.state.information.comment}
                                            />
                                    }
                                </FormItem>
                            </Col>

                            <Col sm={12}>
                                <FormItem
                                    {...infoFormLayout}
                                    label="手机"
                                    hasFeedback
                                >
                                    {
                                        !editable ? <span>{this.state.information.mobile}</span> :
                                            <Input
                                                placeholder='请输入手机号'
                                                {...mobileProps}
                                            />
                                    }
                                </FormItem>
                                <FormItem
                                    {...infoFormLayout}
                                    label="QQ"
                                >
                                    {
                                        !editable ? <span>{this.state.information.qq}</span> :
                                            <Input
                                                placeholder='请输入QQ号'
                                                {...qqProps}
                                            />
                                    }
                                </FormItem>
                            </Col>
                        </Row>


                        <Row>
                            <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                {
                                    window.location.hash.indexOf('/upload/') == -1 ?
                                        '' : <Button type="primary" onClick={this.handleSubmit.bind(this) }>新建</Button>
                                }
                            </Col>
                        </Row>
                    </Form>

                    

                    
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
    
    handleSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            
            $.ajax({
                type: 'POST',
                url:  '/apiv1/information/new',
                data: {
                    type: this.state.type,
                    mobile: values.mobile,
                    name: values.name,
                    qq: values.qq,
                    school: values.school,
                    comment: values.comment,
                    status: -1  // 正在编辑
                },
                success: (res) => {
                    if (res.err == 0) {
                        notification.success({
                            message: 'Success',
                            description: res.msg
                        });

                        window.location.hash = 'information/' + res.information._id;
                    } else {
                        notification.error({
                            message: 'Error',
                            description: res.msg
                        });
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

Information = Form.create()(Information);

export default Information;