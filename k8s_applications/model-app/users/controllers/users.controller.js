const bcrypt = require('bcrypt-nodejs');
const uuid = require('uuid/v4')

const usersModel = require("../models/users.model.js")
const passportModel = require("../models/passport.model.js")
const errorUtils = require("../../common/config/error.utils.js")
const logger = require("../../common/config/winston.config.js").getLogger();

const userRoles = ["Reader", "Writer", "Manager"]; //"SuperManager"


exports.register = function(req, res) {
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let role = userRoles[0];
    let isAllowedToRegister = false;


    if(!req.body.email || !req.body.password){
        res.locals.resData.data = `Please send an email and password\n`;
        res.status(500).json(res.locals.resData);
    }
    if(req.body.role){
        const idx = userRoles.indexOf(req.body.role.charAt(0).toUpperCase() + req.body.role.slice(1).toLowerCase())
        if(idx !== -1){
            role = userRoles[idx];
        }

        if(userRoles.indexOf(req.body.role) >= 2){
            isAllowedToRegister = false;
            if(req.user && userRoles.indexOf(req.user.role) >= 2){
                isAllowedToRegister = true;
            }
        } else {
            isAllowedToRegister = true
        }
    }


    
    if(isAllowedToRegister){
        usersModel.getUserByEmail(req.body.email).then(user => {

            if (!user) {

                usersModel.addUser(uuid(), req.body.email, hash, role)
                .then((result)=>{
                    res.locals.resData.data = `You successfully registered!\n`;
                    res.status(200).json(res.locals.resData);
                }).catch((err)=>{
                    res.locals.resData.data = `Registration Failed!\n`;
                    res.status(200).json(res.locals.resData);
                })
    
            } else {
                res.locals.resData.data = `User is already registered!\n`;
                res.status(200).json(res.locals.resData);
            }
        })
    }
}


setEnabledDisabled = function(req, res, enabled) {
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.email, salt);
    let role = userRoles[0];
    let isAllowedToContinue = false;


    if(!req.body.email){
        res.locals.resData.data = `Please send an email and password\n`;
        res.status(500).json(res.locals.resData);
    }
    if(req.user && userRoles.indexOf(req.user.role) >= 2){
        isAllowedToContinue = true;
    }


    
    if(isAllowedToContinue){
        usersModel.getUserByEmail(req.body.email).then(user => {

            if (user) {

                usersModel.addUser(uuid(), user.email, user.password, user.role, (enabled ? 1 : 0))
                .then((result)=>{
                    res.locals.resData.data = `User was successfully ${enabled ? " enabled" : "disabled"}!\n`;
                    res.status(200).json(res.locals.resData);
                }).catch((err)=>{
                    res.locals.resData.data = `User could not be ${enabled ? " enabled" : "disabled"}!\n`;
                    res.status(200).json(res.locals.resData);
                })

            } else {
                res.locals.resData.data = `User does not exists!\n`;
                res.status(200).json(res.locals.resData);
            }

        })
    }
}


exports.setEnabled = function(req, res){
    setEnabledDisabled(req, res, 1);
}
exports.setDisabled = function(req, res){
    setEnabledDisabled(req, res, 0);
}

exports.edit = function(req, res) {
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let role = userRoles[0];
    const userTemplate = {
        email: "",
        password: "",
        role: ""
    }

    if(!req.body.email){
        res.locals.resData.data = `Please send an email\n`;
        res.status(500).json(res.locals.resData);
    }

    if(req.body.role){
        const idx = userRoles.indexOf(req.body.role.charAt(0).toUpperCase() + req.body.role.slice(1).toLowerCase())
        if(idx !== -1){
            role = userRoles[idx];
        }
    }

    usersModel.getUserByEmail(req.body.email).then(user => {

        if (!user) {

            for(const key of Object.keys(userTemplate)){
                if(req.body[key]){
                    user[key] = req.body[key];
                }
                if(key == "role"){
                    user.role = role;
                }
            }

            usersModel.addUser(uuid(), user.email, user.password, user.role)
            .then((result)=>{
                res.locals.resData.data = `You successfully registered!\n`;
                res.status(200).json(res.locals.resData);
            }).catch((err)=>{
                res.locals.resData.data = `Registration Failed!\n`;
                res.status(200).json(res.locals.resData);
            })

        } else {
            res.locals.resData.data = `User is already registered!\n`;
            res.status(200).json(res.locals.resData);
        }
    })

}


exports.login = function(req, res, next) {
    
    passportModel.authenticate(req, res, next)
    .then((result)=>{
        res.locals.resData.data = `${result}`;
        res.status(200).json(res.locals.resData);
    }).catch((err)=>{
        res.locals.resData.data = `Authentication Failed`;
        res.status(500).json(res.locals.resData);
    })

}


exports.loginAsSuper = function(req, res, next) {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.email, salt);
    console.log(hash)

    usersModel.getUserByEmail(req.body.email).then(user => {

        req.body.role = req.body.role.charAt(0).toUpperCase() + req.body.role.slice(1).toLowerCase();

        if (user && userRoles.indexOf(req.body.role) >= 2 && req.body.token == hash) {

            passportModel.authenticate(req, res, next)
            .then((result)=>{
                req.user.role = req.body.role
                res.locals.resData.data = `${result}`;
                res.status(200).json(res.locals.resData);
            }).catch((err)=>{
                res.locals.resData.data = `Authentication Failed`;
                res.status(500).json(res.locals.resData);
            })

        } else {
            res.locals.resData.data = `You cannot login as Super!\n`;
            res.status(200).json(res.locals.resData);
        }
    })
}

exports.logout = function(req, res, next) {

    passportModel.getSessionData(req.sessionID)
    .then((sessionData)=>{

        sessionData = JSON.parse(sessionData)  
        if(sessionData.passport.user){
            passportModel.logoutUser(sessionData.passport.user)
        }
        req.logout();

        res.locals.resData.data = `Successfully logged out`;
        res.status(200).json(res.locals.resData);    
    })
    .catch((err)=>{
        res.locals.resData.data = `Couldn't perform logging out`;
        res.status(500).json(res.locals.resData);
    })

}


exports.getEndpoints = function(req, res) {
    
    const data = {
        endpoints: [
            "/api/v1/users/register/",
            "/api/v1/users/login/",
            "/api/v1/users/logout/",
            "/api/v1/users/edit/"
        ]
    }
    res.locals.resData.data = data;
    res.status(200).json(res.locals.resData);
}

exports.getAPI_versions = function(req, res) {
    
    const data = {
        currentApiVersion: currentApiVersion,
        pastApiVersions: []
    }
    res.locals.resData.data = data;
    res.status(200).json(res.locals.resData);
}

exports.InvalidEndPoint = function(req, res) {
    errorUtils.createError(404, "Invalid Endpoint", "Send a GET Request at /data/api for more information");
};