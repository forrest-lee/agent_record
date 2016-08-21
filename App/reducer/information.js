/**
 * Created by leo on 8/22/16.
 */
'use strict';

let initialState = [];

let information = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_INFOS':
            return [...action.infos];
        default:
            return state;
    }
};

export default information;