/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import { Icon, Table, Form, Input, Button, Checkbox, Select, Row, Col, Upload, message, notification } from 'antd';
const FormItem = Form.Item;
const Dragger  = Upload.Dragger;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);


class Attachment extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let style = {
            preWrap: cx({
                'preWrap': true
            }),
            borderBox: cx({
                'border-container': true
            })
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
        );
    }
}

export default Attachment;