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
import styles from './styles.scss';
let cx = classNames.bind(styles);

class Information extends React.Component {
    constructor(props) {
        super(props);
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
                                    label="备注"
                                    hasFeedback
                                >
                                    <Input placeholder="备注" />
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
                    
                    <Row gutter={10} style={{marginTop: 20}} className={style.borderBox}>
                        <Col sm={6} style={{borderRight: '2px dotted #ddd'}}>
                            <pre className={style.preWrap}>
                                <strong>附件:</strong><br/>
                                    1. 身份证正面<br/>
                                    2. 身份证反面<br/>
                                    3. 手持身份证照片<br/>
                                    4. 学信网学籍截图<br/>
                                    5. 近三个通话详单(Excel)<br/>
                                    6. 淘宝收货地址截图<br/>
                                    7. 资料申请表<br/>
                            
                                <br/><strong>注意:</strong><br/>
                                    仅当处于正在编辑和退回状态时, 才能修改信息和上传、删除文件<br/>
                                
                                <br/>父母电话一定要百分之百真实, 如果虚假百分之百被拒。一经被拒永久不能申请。
                            </pre>
                        </Col>
                        <Col sm={18}>
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
                        </Col>
                    </Row>
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