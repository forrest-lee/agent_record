/**
 * Created by leo on 8/15/16.
 */
import React from 'react';
import {
    Form,
    Input,
    Button,
    Checkbox,
    Select,
    Row,
    Col,
    Upload,
    Icon
} from 'antd';
const FormItem = Form.Item;

import classNames from 'classnames';
import styles from '../styles.scss';
let cx = classNames.bind(styles);

class Information extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { getFieldProps } = this.props.form;
        
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol:{ span: 20 }
        };
        
        return (
            <div>
                <h1>新建: 借款资料上传</h1>
                <div style={{marginTop: 10}}>
                    <Form horizontal>
                        <Row gutter={10}>
                            <Col sm={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label='类型'
                                    hasFeedback
                                >
                                    <Select
                                        {...getFieldProps('select')}
                                    >
                                        <Option value="information">借款资料</Option>
                                        <Option value="contract">借款合同</Option>
                                    </Select>
                                </FormItem>
    
                                <FormItem
                                    {...formItemLayout}
                                    label="姓名"
                                    hasFeedback
                                >
                                    <Input placeholder="姓名" />
                                </FormItem>
    
                                <FormItem
                                    {...formItemLayout}
                                    label="学校"
                                    hasFeedback
                                >
                                    <Input placeholder="学校" />
                                </FormItem>
                                
                            </Col>
                            
                            <Col sm={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="手机号"
                                    hasFeedback
                                >
                                    <Input type="mobile" placeholder='请输入手机号' />
                                </FormItem>
    
                                <FormItem
                                    {...formItemLayout}
                                    label="QQ号"
                                    hasFeedback
                                >
                                    <Input type="qq" placeholder='请输入QQ号' />
                                </FormItem>
    
                                <FormItem
                                    {...formItemLayout}
                                    label="附件"
                                    help="上传审核资料"
                                >
                                    <Upload name="logo" action="/upload.do" listType="picture" onChange={this.handleUpload}
                                            {...getFieldProps('upload', {
                                                valuePropName: 'fileList',
                                                normalize: this.normFile,
                                            })}
                                    >
                                        <Button type="ghost">
                                            <Icon type="upload" /> 点击上传
                                        </Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                        
                        
    
                        <Row>
                            <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
                                {/*<Button type="ghost" onClick={this.handleReset.bind(this)}>清空</Button>*/}
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
    
}

Information = Form.create()(Information);

export default Information;