import React, {Component} from 'react';

import 'antd/dist/antd.css';

import {
    Menu,
    Button,
    Table,
    Spin,
    Form,
    Input,
    Row,
    Col,
    DatePicker
} from 'antd';

const FormItem = Form.Item;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const columns = [{
    title: '职位名称',
    dataIndex: 'position_name',
    key: 'position_name'
}, {
    title: '公司简称',
    dataIndex: 'company_short',
    key: 'company_short'
}, {
    title: '融资规模',
    dataIndex: 'finance_stage',
    key: 'finance_stage'
}, {
    title: '所在行业',
    dataIndex: 'industry',
    key: 'industry'
}, {
    title: '所在城市',
    dataIndex: 'city',
    key: 'city'
}, {
    title: '工作年限',
    dataIndex: 'work_year',
    key: 'work_year'
}, {
    title: '薪水',
    dataIndex: 'salary',
    key: 'salary'
}];


class Position extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        $.ajax({
                type:     'GET',
                url:      '/api/v1/position/all',
                dataType: 'json',
                success:  function (res) {
                    var data = [];
                    res.data.map((item, index) => {
                        item.key = index;
                    });
                    this.setState({data: res.data, loading: false});
                }.bind(this),
                error:    function (err) {
                    console.log(err);
                }
            });
    }

    render() {
        if(this.state.loading) {
            // return (
            //     <Spin />
            // );
        }

        return (
            <div>
                <div style={{marginTop: 0}}>
                    <Table columns={columns} dataSource={this.state.data}
                        loading={this.state.loading}
                    />
                </div>
            </div>
        );
    }
}

export default Position;
