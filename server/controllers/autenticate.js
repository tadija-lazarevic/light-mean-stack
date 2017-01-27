var moment      = require('moment');
var jwt         = require('jwt-simple');
var autenticate = require('../controllers/autenticate');


module.exports = {
    createJWT         : function (user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, process.env.SECRET);
    },
    ensureAutenticated: function (req, res, next) {
        if (!req.header('authorization')) {
            return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
        }
        var token = req.header('authorization').split(' ')[1];

        var payload = null;
        try {
            payload = jwt.decode(token, process.env.SECRET);
        }
        catch (err) {
            return res.status(401).send({message: err.message});
        }

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Token has expired'});
        }
        req.user = payload.sub;
        next();
    }
};