/**
 * Created by leo on 8/21/16.
 */
'use strict';

let initialState = [];

let agent = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_AGENCY':
            return [...action.agents];
        default:
            return state;
    }
};

export default agent;