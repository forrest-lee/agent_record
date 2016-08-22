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
import settings from '../../../settings.js';


class Attachment extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        var id = getUrlId('information');
        
        $.ajax({
            type:    'GET',
            url:     '/apiv1/information/' + id + '/attachments',
            error:   (res) => {
                notification.error({
                    message: '网络错误',
                    description: '如果该问题重复出现请联系客服人员'
                });
            },
            success: (res) => {
                if (res.err == 0) {
                    //console.log('success res:');
                    //console.log(res);
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.msg
                    });
                }
            }
        });
    
        // TODO: 目前没有考虑微信内场景上传图片
        this.qiniu();
    }
    
    render() {
        var id = getUrlId('information');
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
            action: '/apiv1/information/' + id + '/attachments',
            headers: {
                authorization: 'files',
            },
            multiple: true,
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
                    <div id="qncontainer" style={{marginTop: 20}}>
                        <Button type="ghost" id="pickfiles">
                            <Icon type="upload" /> 选择文件
                        </Button>
                    </div>
    
                    {/*<Upload {...uploadProps}>*/}
                        {/*<Button type="ghost">*/}
                            {/*<Icon type="upload" /> 点击上传*/}
                        {/*</Button>*/}
                    {/*</Upload>*/}
                </Col>
            </Row>
        );
    }
    
    qiniu() {
        var id = getUrlId('information');
        
        //引入Plupload 、qiniu.js后
        var uploader = Qiniu.uploader({
            multi_selection: true,
            runtimes: 'html5',    //上传模式,依次退化
            browse_button: 'pickfiles',
            uptoken_url:   '/apiv1/qiniu/uptoken',
            unique_names:  true,
            domain:        settings.QN_Domain,
            container:     'qncontainer',
            max_file_size: '800kb',
            max_retries:   3,
            dragdrop:      true,
            drop_element:  'container',
            chunk_size:    '800kb',
            auto_start:    true,
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后,处理相关的事情
                    });
                },
                'BeforeUpload': function(up, file) {
                    // 每个文件上传前,处理相关的事情
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时,处理相关的事情
                },
                'FileUploaded': function(up, file, info) {
                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                
                    // var domain = up.getOption('domain');
                    // var res = parseJSON(info);
                    // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                    
                    console.log(info);
                },
                'Error': function(up, err, errTip) {
                    //上传出错时,处理相关的事情
                },
                'UploadComplete': function() {
                    //队列文件处理完毕后,处理相关的事情
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                
                    var key = "";
                    // do something with key here
                    return key
                }
            }
        });
    
        // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
    
        // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
    }
}

export default Attachment;