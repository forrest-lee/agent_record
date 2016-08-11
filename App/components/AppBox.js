/**
 * Created by leo on 8/12/16.
 */
import React from 'react';

class AppBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default AppBox;