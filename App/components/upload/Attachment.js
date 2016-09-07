/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import { Icon, Table, Form, Input, Button, Checkbox, Select, Row, Col, Upload, message, notification, Progress } from 'antd';
const FormItem = Form.Item;
const Dragger  = Upload.Dragger;

import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);
import settings from '../../../settings.js';
import configs from '../../../configs';

class Attachment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            
            showProgress: false,
            filename: '',
            progress: 0
        }
    }
    
    componentDidMount() {
        var id = getUrlId('information');
        
        $.ajax({
            type:    'GET',
            url:     '/apiv1/information/' + id + '/attachments',
            error:   (res) => {
                notification.error({
                    message:     '网络错误',
                    description: '如果该问题重复出现请联系客服人员'
                });
            },
            success: (res) => {
                if (res.err == 0) {
                    this.setState({
                        fileList: res.attaches
                    })
                } else {
                    notification.error({
                        message:     'Error',
                        description: res.msg
                    });
                }
            }
        });
        
        // TODO: 目前没有考虑微信内场景上传图片
        this.qiniu();
    }
    
    render() {
        var id    = getUrlId('information');
        let style = {
            preWrap:   cx({
                'preWrap': true
            }),
            borderBox: cx({
                'border-container': true
            })
        };
    
        var status = this.props.information.status;
        var editable = status == -1 || status == 3;
        
        return (
            <Row gutter={10} style={{marginTop: 20}} className={style.borderBox}>
                <Col sm={6} style={{borderRight: '2px dotted #ddd'}}>
                    {
                        configs.domain == 'jinqiandai' ?
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
                            </pre> :
                            <pre className={style.preWrap}>
                                <strong>附件: </strong><br/>
                                1. 身份证正面反面，手持身份证照片<br/>
                                2. 学生证封面、信息页、注册页<br/>
                                3. 手持申请表照片、协议照片、协议照片（要能看到签名的）<br/>
                                备注：协议可电脑填写完再打印，或者直接手写，但签名必须手写，协议中有一个推荐人，写代理的名字或者不写，交单可先交电子表格，不需要打印，通过了再补交<br/>
                                <br/><strong>注意: </strong><br/>
                                仅当处于正在编辑和退回状态时, 才能修改信息和上传、删除文件<br/>
                                <br/>父母电话一定要百分之百真实, 如果虚假百分之百被拒。一经被拒永久不能申请。
                            </pre>
                    }
                </Col>
                <Col sm={18}>
                    <div id="qncontainer" style={{marginTop: 10}}>
                        {
                            !editable ? '' :
                                <Button type="ghost" id="pickfiles">
                                    <Icon type="upload"/> 选择文件
                                </Button>
                        }
                    </div>
                    
                    <Button type="default" style={{marginTop: 10}} icon="download"
                            disabled={this.state.fileList.length == 0}
                            onClick={this.downloadAll.bind(this)}
                    >
                        全部下载
                    </Button>
    
                    
                    {
                        !this.state.showProgress ? '' :
                            <div style={{marginTop: 10}}>
                                <h3>正在上传: {this.state.filename}</h3>
                                <Progress percent={this.state.progress} />
                            </div>
                    }
                    
                    {this.state.fileList.length == 0 ? <h2>暂无文件</h2> : null}
                    <div className='ant-upload-list ant-upload-list-picture' style={{marginTop: 10}}>
                        {
                            this.state.fileList.map((item, index) => {
                                var iconUrl = item.url;
                                if(item.filename.indexOf('xls') > 0) {
                                    iconUrl ='/public/images/excel.png'
                                } else if(item.filename.indexOf('doc') > 0) {
                                    iconUrl ='/public/images/word.png'
                                } else if (item.filename.indexOf('mp4') > 0) {
                                    iconUrl ='/public/images/video.jpg'
                                }
                                return (
                                    <div className='ant-upload-list-item ant-upload-list-item-done'>
                                        <div className='ant-upload-list-item-info'>
                                            <a className='ant-upload-list-item-thumbnail' href={item.url}>
                                                <img style={{width: 48, height: 48, display: 'block'}} src={iconUrl} alt=""/>
                                            </a>
                                            <a className='ant-upload-list-item-name' onClick={this.saveFile.bind(this, item.url, item.filename)}>{item.filename}</a>
                                            <i className='anticon anticon-cross' onClick={this.handleDelete.bind(this, item, index)}></i>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </Col>
            </Row>
        );
    }
    
    saveFile(url, name) {
        fetch(url).then(res => res.blob().then(blob => {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(blob);
            var filename = name;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }))
    }
    
    
    downloadAll() {
        this.state.fileList.map(file => {
            this.saveFile(file.url, file.filename);
        });
    }
    
    
    qiniu = () => {
        var id   = getUrlId('information');
        var that = this;
        
        //引入Plupload 、qiniu.js后
        var uploader = Qiniu.uploader({
            multi_selection: true,
            runtimes:        'html5',    //上传模式,依次退化
            browse_button:   'pickfiles',
            uptoken_url:     '/apiv1/qiniu/uptoken',
            unique_names:    true,
            save_key:        true,
            domain:          settings.QN_Domain,
            container:       'qncontainer',
            max_file_size:   '30mb',
            max_retries:     3,
            dragdrop:        true,
            drop_element:    'container',
            chunk_size:      '30mb',
            auto_start:      true,
            init:            {
                'FilesAdded':     function (up, files) {
                    plupload.each(files, function (file) {
                        // 文件添加进队列后,处理相关的事情
                    });
                },
                'BeforeUpload':   (up, file) => {
                    // 每个文件上传前,处理相关的事情
                    this.setState({filename: file.name, progress: 0, showProgress: true});
                },
                'UploadProgress': (up, file) => {
                    // 每个文件上传时,处理相关的事情
                    this.setState({progress: file.percent})
                },
                'FileUploaded':   (up, file, info) => {
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
                    
                    var domain     = up.getOption('domain');
                    var fileInfo   = $.parseJSON(info);
                    var sourceLink = domain + fileInfo.key;  //获取上传成功后的文件的Url
                    $.ajax({
                        type:    'POST',
                        url:     '/apiv1/information/add_attachments',
                        data:    {
                            infoId:   id,
                            filename: file.name.toString(),
                            key:      fileInfo.key,
                            url:      sourceLink,
                            hash:   fileInfo.hash
                        },
                        error:   () => {
                            alert("异常");
                        },
                        success: (res) => {
                            if (res.err == 0) {
                                var fileList = this.state.fileList;
                                fileList.push(res.attach);
                                this.setState({fileList: fileList});
                                
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
                        }
                    })
                },
                'Error':          function (up, err, errTip) {
                    //上传出错时,处理相关的事情
                    console.error(errTip);
                    notification.error({
                        message:     'Error',
                        description: errTip
                    });
                },
                'UploadComplete': () => {
                    //队列文件处理完毕后,处理相关的事情
                    this.setState({showProgress: false})
                },
                'Key':            function (up, file, info) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    var key = file.name.toString();
                    // do something with key here
                    return key
                }
            }
        });
        
        // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
        
        // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
    };
    
    handleDelete(obj, index) {
        $.ajax({
            type: 'POST',
            url: '/apiv1/attach/delete',
            data: {
                id: obj._id
            },
            success: (res) => {
                if(res.err == 0) {
                    var fileList = this.state.fileList;
                    fileList.splice(index, 1);
                    this.setState({fileList: fileList});
                    
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
            error: (err) => {
                console.error(err);
            }
        })
    }
}

export default Attachment;