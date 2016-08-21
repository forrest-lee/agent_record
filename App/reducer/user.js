/**
 * Created by leo on 8/20/16.
 */
'use strict';

let initialState = {};

let user = (state = initialState, action) => {
    switch(action.type) {
        case 'USER_LOGIN':
            console.log(action.user);
            return {...action.user};
        default:
            return state;
    }
};

export default user;
