var mongoose = require('mongoose');
var io       = require('socket.io');
var multer   = require('multer');
var path     = require('path');
var request  = require('request');
var crypto   = require('crypto');

var User = mongoose.model('User');


/*
 * LOGIN user.
 */
exports.signin = function (req, res, next) {
    User.findOne({email: req.body.email}, '+ email + password + status ', function (err, user) {
        if (!user) {
            return res.status(401).send({message: 'emailError'});
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({message: 'passwordError'});
            }
            else if (user.toObject().status == 'Inactive') {
                return res.status(401).send({message: 'accountDisabled'});
            } else if (user.toObject().status == 'NotActivated') {
                return res.status(401).send({message: 'accountDisabled'});
            }
            else {
                user = user.toObject();

                // Remove private fields
                user.password = undefined;
                user.status   = undefined;
                user.email    = undefined;

                return res.status(200).send({
                    message: 'loginOk',
                    token  : autenticate.createJWT(user),
                    logged : user
                });
            }
        });
    })
};

/*
 * REGISTER user.
 */
exports.signup = function (req, res, next) {

    if (!req.body.password || !req.body.name.displayName || !req.body.email || !req.body.password_confirmation) {
        return res.status(404).send({status: 404, message: 'missingParams'});
    }

    if (req.body.password !== req.body.password_confirmation) {
        return res.status(404).send({status: 404, message: 'noPassMatch'});
    }

    var user = new User(req.body);

    if (req.body.password.length < 6) {
        return res.status(404).send({status: 404, message: 'passLengthError'});
    }

    User.find({'name.displayName': req.body.name.displayName}, function (err, users) {
        if (err || users.length > 0) {
            return res.status(409).send({message: 'duplicatedUserName'});
        }
        User.find({email: req.body.email}, function (err, users) {
            if (err || users.length > 0) {
                return res.status(409).send({message: 'duplicatedEmail'});
            }

            crypto.randomBytes(48, function (err, buffer) {
                var token = buffer.toString('hex');

                user.activationToken        = token;
                user.activationTokenExpires = Date.now() + 172800000; // 2 days
                user.status                 = 'NotActivated';

                user.save(function (err, result) {
                    if (err) {
                        res.status(500).send({message: err.message});
                    }
                    user = user.toObject();
                    delete user.password;

                    emailTemplates(emailTemplatesDir, function (err, template) {

                        if (err) {
                            console.log(err);
                        } else {

                            // Prepare nodemailer transport object
                            var transport = nodemailer.createTransport(connection, {
                                from: process.env.MTL_EMAIL
                            });

                            // An example users object with formatted email function
                            var locals = {
                                line: {
                                    name     : req.body.name.displayName,
                                    register : "We're ready to activate your account. All we need to do is make sure this is your email address.",
                                    tokenLink: "http://" + req.headers.host + "/api/user/activate/" + token
                                }
                            };

                            // Send a single email
                            template("register_confirm", locals, function (err, html, text) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    transport.sendMail({
                                        to     : req.body.email,
                                        subject: 'ExampleApp Account Confirmation',
                                        html   : html,
                                        text   : text
                                    }, function (err, responseStatus) {
                                        if (err) {
                                            return res.status(500).send({status: 500, message: 'signupError'});
                                        } else {
                                            if (responseStatus.accepted.length > 0) {
                                                return res.status(200).send({status: 200, message: 'signupOK'});
                                            }
                                            else if (responseStatus.rejected.length > 0) {
                                                User.remove({email: req.body.email}, function (err, users) {
                                                    return res.status(500).send({status: 500, message: 'signupError'});
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    });
};
