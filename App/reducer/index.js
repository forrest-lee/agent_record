/**
 * Created by leo on 8/20/16.
 */
import { combineReducers } from 'redux';
import userReducer from './user.js';

export default combineReducers({
    user: userReducer
});

