/**
 * Created by leo on 8/15/16.
 */
import React from 'react';
import {
    Table,
    Form,
    Input,
    Button,
    Checkbox,
    Select,
    Row,
    Col,
    Upload,
    Icon,
    message,
    notification
} from 'antd';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);


class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
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

        const commentFormLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        };

        const uploadProps = {
            name: 'file',
            action: '/upload',
            headers: {
                authorization: 'files',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功。`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败。`);
                }
            },
        };
    
        const typeProps = getFieldProps('role', {
            rules:   [
                {required: true, message: '请选择代理类别'}
            ],
            trigger: ['onBlur', 'onChange']
        });
        const nameProps = getFieldProps('name', {
            rules: [
                {required: true, min: 2, message: '请填写客户姓名(至少两个字)'},
            ],
            trigger: ['onBlur', 'onChange']
        });
        const mobileProps = getFieldProps('mobile', {
            rules: [
                {required: true, len: 11, message: '手机号必须为11位'},
            ],
            trigger: ['onBlur', 'onChange']
        });
        const qqProps = getFieldProps('qq', {
            rules: [
                {required: true, message: '请填写QQ号'},
            ],
            trigger: ['onBlur', 'onChange']
        });
        const schoolProps = getFieldProps('school', {
            rules: [
                {required: true, message: '请填写学校名称'}
            ],
            trigger: ['onBlur', 'onChange']
        });

        return (
            <div>
                <h1>新建: 借款资料上传</h1>
                <div style={{ marginTop: 10 }}>
                    <Form horizontal>
                        <Row gutter={10}>
                            <Col sm={12}>
                                <FormItem
                                    {...infoFormLayout}
                                    label='类型'
                                    hasFeedback
                                >
                                    <Select
                                        {...typeProps}
                                        placeholder='请选择'
                                    >
                                        <Option value="information">借款资料</Option>
                                        <Option value="contract">借款合同</Option>
                                    </Select>
                                </FormItem>

                                <FormItem
                                    {...infoFormLayout}
                                    label="姓名"
                                    hasFeedback
                                >
                                    <Input {...nameProps} placeholder="姓名" />
                                </FormItem>

                                <FormItem
                                    {...infoFormLayout}
                                    label="学校"
                                    hasFeedback
                                    >
                                    <Input {...schoolProps} placeholder="学校" />
                                </FormItem>

                            </Col>

                            <Col sm={12}>
                                <FormItem
                                    {...infoFormLayout}
                                    label="手机号"
                                    hasFeedback
                                >
                                    <Input {...mobileProps} type="mobile" placeholder='请输入手机号' />
                                </FormItem>

                                <FormItem
                                    {...infoFormLayout}
                                    label="QQ号"
                                    hasFeedback
                                >
                                    <Input {...qqProps} type="qq" placeholder='请输入QQ号' />
                                </FormItem>

                                <FormItem
                                    {...infoFormLayout}
                                    label="备注"
                                    hasFeedback
                                >
                                    <Input {...getFieldProps('comment')} placeholder="备注" />
                                </FormItem>

                            </Col>
                        </Row>


                        <Row>
                            <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                <Button type="primary" onClick={this.handleSubmit.bind(this) }>确定</Button>
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
            
            console.log(values);
            
            $.ajax({
                type: 'POST',
                url:  '/apiv1/information/new',
                data: {
                    type: values.type,
                    mobile: values.mobile,
                    name: values.name,
                    qq: values.qq,
                    school: values.school,
                    comment: values.comment
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