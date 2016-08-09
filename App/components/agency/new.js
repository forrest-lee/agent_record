import React from 'react';
import classNames from 'classnames';

import { Form, Input, Button, Checkbox, Radio, Tooltip, Icon, Select } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


export default class NewClient extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <h2>新增代理</h2>
                <Form horizontal>
                    <FormItem
                        id="control-input"
                        label="名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input id="control-input" placeholder="请输入姓名" />
                    </FormItem>
        
                    <FormItem
                        id="select"
                        label="代理类型"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Select id="select" size="large" style={{ width: 200 }}
                                placeholder="请选择代理类型"
                                onChange={this.handleSelectChange}
                        >
                            <Option value="0">一级代理</Option>
                            <Option value="1">二级代理</Option>
                            <Option value="2">三级代理</Option>
                        </Select>
                    </FormItem>
    
                    <FormItem
                        id="control-input"
                        label="父级代理"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input id="control-input" placeholder="请输入父级代理帐号" />
                    </FormItem>
                    
                    <FormItem
                        label="性别"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RadioGroup defaultValue="b">
                            <Radio value="male">男</Radio>
                            <Radio value="female">女</Radio>
                        </RadioGroup>
                    </FormItem>
    
                    <FormItem
                        id="control-input"
                        label="手机号"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input id="control-input" placeholder="请输入手机号" />
                    </FormItem>
    
                    <FormItem
                        id="control-textarea"
                        label="备注"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input type="textarea" id="control-textarea" rows="3" />
                    </FormItem>
                </Form>
            </div>
        );
    }
    
    handleSelectChange(value) {
        console.log(`selected ${value}`);
    }
}