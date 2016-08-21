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
    message
} from 'antd';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);

const columns = [{
    title: '提交人',
    dataIndex: 'owner',
    key: 'owner'
}, {
    title: '时间',
    dataIndex: 'updateAt',
    key: 'updateAt'
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
}, {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment'
}];

const dataSource = [{
    owner: '风控1',
    updateAt: '2016-08-11 18:42',
    status: '返回',
    comment: '客户电话无法接通'
}, {
    owner: '人人花1',
    updateAt: '2016-08-11 18:42',
    status: '同意',
    comment: ''
}];

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
                                        {...getFieldProps('select') }
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
                                    <Input placeholder="姓名" />
                                </FormItem>

                                <FormItem
                                    {...infoFormLayout}
                                    label="学校"
                                    hasFeedback
                                    >
                                    <Input placeholder="学校" />
                                </FormItem>

                            </Col>

                            <Col sm={12}>
                                <FormItem
                                    {...infoFormLayout}
                                    label="手机号"
                                    hasFeedback
                                >
                                    <Input type="mobile" placeholder='请输入手机号' />
                                </FormItem>

                                <FormItem
                                    {...infoFormLayout}
                                    label="QQ号"
                                    hasFeedback
                                >
                                    <Input type="qq" placeholder='请输入QQ号' />
                                </FormItem>

                                <FormItem
                                    {...infoFormLayout}
                                    label="备注"
                                    hasFeedback
                                >
                                    <Input placeholder="备注" />
                                </FormItem>

                            </Col>
                        </Row>


                        <Row>
                            <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                <Button type="primary" onClick={this.handleSubmit.bind(this) }>确定</Button>
                                {/*<Button type="ghost" onClick={this.handleReset.bind(this)}>清空</Button>*/}
                            </Col>
                        </Row>
                    </Form>

                    <Row gutter={10} style={{ marginTop: 20 }} className={style.borderBox}>
                        <Col sm={6} style={{ borderRight: '2px dotted #ddd' }}>
                            <pre className={style.preWrap}>
                                <strong>附件: </strong><br/>
                                1. 身份证正面<br/>
                                2. 身份证反面<br/>
                                3. 手持身份证照片<br/>
                                4. 学信网学籍截图<br/>
                                5. 近三个通话详单(Excel) <br/>
                                6. 淘宝收货地址截图<br/>
                                7. 资料申请表<br/>

                                <br/><strong>注意: </strong><br/>
                                仅当处于正在编辑和退回状态时, 才能修改信息和上传、删除文件<br/>

                                <br/>父母电话一定要百分之百真实, 如果虚假百分之百被拒。一经被拒永久不能申请。
                            </pre>
                        </Col>
                        <Col sm={18}>
                            <Upload {...uploadProps}>
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 36 }}>
                        <h2 style={{marginBottom: 10}}>审核信息记录</h2>
                        <Table dataSource={dataSource} columns={columns} />
                    </div>

                    <div style={{padding: '20px 15px 1px', backgroundColor: '#f7f7f7', borderRadius: 15}}>
                        <h2 style={{marginBottom: 10}}>发布审核信息</h2>
                        <Form horizontal>
                            <FormItem
                                id="select"
                                label="操作"
                                {...commentFormLayout}
                            >
                                <Select
                                    id="select" size="large" style={{ width: 200 }}
                                    onChange={this.handleStatusChange.bind(this)}
                                    placeholder='请选择'
                                >
                                    <Option value="1">通过</Option>
                                    <Option value="2">退回</Option>
                                    <Option value="3">否决</Option>
                                </Select>
                            </FormItem>
        
                            <FormItem
                                id="control-textarea"
                                label="备注"
                                {...commentFormLayout}
                            >
                                <Input type="textarea" id="control-textarea" rows="3" />
                            </FormItem>
    
                            <FormItem wrapperCol={{ span: 16, offset: 2 }} style={{ marginTop: 0 }}>
                                <Button type="primary" htmlType="submit">提交</Button>
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
        if (!!errors) {
            console.log('Errors in form!!!');
            return;
        }
    
        $.ajax({
            type:    'POST',
            url:     '/apiv1/loanForm/new',
            data:    {
                
                comment:  values.comment
            },
            success: function (res) {
                if(res.err == 0) {
                    notification.success({
                        message:     'Success',
                        description: res.msg
                    });
                    window.location.hash = 'agent/all';
                } else {
                    notification.error({
                        message:     'Error',
                        description: res.msg
                    });
                }
            },
            error:   function (err) {
                notification.error({
                    message:     'Error',
                    description: res.msg
                });
            }
        });
    }


    handleStatusChange() {

    }

}

Information = Form.create()(Information);

export default Information;