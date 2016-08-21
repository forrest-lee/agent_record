/**
 * Created by leo on 8/21/16.
 */
'use strict';

let initialState = [];

let agency = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_AGENCY':
            return [...action.agent];
        default:
            return state;
    }
};

export default agency;