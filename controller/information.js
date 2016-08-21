/**
 * Created by leo on 8/22/16.
 */
var Information = require('../models/Information');

/**
 * 查询所有客户信息
 * @param req
 * @param res
 */
exports.allClient = function(req, res) {
    // TODO: 权限验证, 只有父级代理有权(中间件也需要加)
    
    Information.find({})
        .exec((err, infos) => {
            if(err) {
                return res.json({
                    err: 1,
                    msg: err
                });
            } else {
                return res.json({
                    err: 0,
                    infos: infos
                });
            }
        });
};