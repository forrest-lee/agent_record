/**
 * Created by leo on 8/22/16.
 */
import React from 'react';

import InfoForm from './InfoForm';
import Attachment from './Attachment';
import Message from './Message';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as userActions from '../../action/user';

class UploadBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <InfoForm/>
                <Attachment/>
                <Message/>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadBox);