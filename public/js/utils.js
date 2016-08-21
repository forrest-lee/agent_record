/**
 * Created by leo on 8/22/16.
 */
/**
 * 获取url中的query参数
 * @param name
 * @returns {*}
 * Author: Shine <shinepans@live.com> 2016-05-27
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.hash.split('?')[1].match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 * 获取url中的id
 * @param name
 * @returns {*}
 * Author: Shine <shinepans@live.com> 2016-05-27
 */
function getUrlId(name) {
    var reg = new RegExp("(^|/)" + name + "/([^/]*)(/|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.hash.split('?')[0].match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}