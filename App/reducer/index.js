/**
 * Created by leo on 8/20/16.
 */
import { combineReducers } from 'redux';
import userReducer from './user.js';
import agentReducer from './agent';
import information from './infos';

export default combineReducers({
    user: userReducer,
    agent: agentReducer,
    infos: information,
});

