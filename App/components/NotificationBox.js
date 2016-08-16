/**
 * Created by leo on 8/15/16.
 */
import React from 'react';
import classNames from 'classnames';
import {
    Table,
    Button,
    Input,
    Spin
} from 'antd';
const InputGroup = Input.Group;

const columns = [{
    title: '公告标题',
    dataIndex: 'title',
    key: 'title'
}, {
    title: '发布时间',
    dataIndex: 'updateAt',
    key: 'updateAt'
}, {
    title: '发布人',
    dataIndex: 'owner',
    key: 'owner'
}];

const dataSource = [{
    title: '全体请注意',
    updateAt: '2016-08-11 18:42',
    owner: '人人花1',
}, {
    title: '新手须知',
    updateAt: '2016-08-11 15:19',
    owner: '人人花1'
}];

export default class NotificationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />;
        }
        
        return (
            <div>
                
                <div style={{marginTop: 20}}>
                    <Table dataSource={dataSource} columns={columns} />
                </div>
            </div>
        )
    }
    
}