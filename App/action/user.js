/**
 * Created by leo on 8/21/16.
 */
'use strict';

export function login(userObj) {
    return {
        type: 'USER_LOGIN',
        user:  userObj
    }
}