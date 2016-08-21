/**
 * Created by leo on 8/20/16.
 */
import { combineReducers } from 'redux';
import userReducer from './user.js';
import agencyReducer from './agent';
import information from './information';

export default combineReducers({
    user: userReducer,
    agency: agencyReducer,
    infos: information,
});

