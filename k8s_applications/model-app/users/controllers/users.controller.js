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

    logger.debug(logger.createEntry("users.controller.register", "Registering User", JSON.stringify(req.body)));

    if(!req.body.email || !req.body.password){
        logger.warn(logger.createEntry("users.controller.register", "Request malformed", `Email: ${req.body.email}, Password: ${req.body.password}`));
        res.locals.resData.data = `Please send an email and password\n`;
        res.status(500).json(res.locals.resData);
    }
    if(req.body.role){
        const idx = userRoles.indexOf(req.body.role.charAt(0).toUpperCase() + req.body.role.slice(1).toLowerCase())
        if(idx !== -1){
            role = userRoles[idx];
        }

        if(userRoles.indexOf(role) >= 2){
            isAllowedToRegister = false;
            logger.trace(logger.createEntry("users.controller.register", "Registering an Admin needs special permission", `Role: ${role}`));
            
            if(req.user && userRoles.indexOf(req.user.role) >= 2){
                isAllowedToRegister = true;
            } else {
                logger.warn(logger.createEntry("users.controller.register", "Current User does not have permission to register Admin", `Current User Role: ${req.user.role}`));
            }

        } else {
            isAllowedToRegister = true
        }
    } else {
        isAllowedToRegister = true
        role = userRoles[0];
    }


    
    if(isAllowedToRegister){
        usersModel.getUserByEmail(req.body.email).then(user => {

            if (!user) {

                usersModel.addUser(uuid(), req.body.email, hash, role)
                .then((result)=>{
                    logger.trace(logger.createEntry("users.controller.register", "User was successfully registered", ``));
                    res.locals.resData.data = `You successfully registered!\n`;
                    res.status(200).json(res.locals.resData);
                }).catch((err)=>{
                    logger.error(logger.createEntry("users.controller.register", "Error occured while adding the user", `${err}`));
                    res.locals.resData.data = `Registration Failed!\n`;
                    res.status(200).json(res.locals.resData);
                })
    
            } else {
                logger.trace(logger.createEntry("users.controller.register", "User is already registered", `User Data: ${JSON.stringify(user)}`));
                res.locals.resData.data = `User is already registered!\n`;
                res.status(200).json(res.locals.resData);
            }
        })
    } else {
        logger.error(logger.createEntry("users.controller.register", "User is not allowed to register", ``));
        res.locals.resData.data = `User is not allowed to register\n`;
        res.status(500).json(res.locals.resData);       
    }
}


setEnabledDisabled = function(req, res, enabled) {
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.email, salt);
    let role = userRoles[0];
    let isAllowedToContinue = false;

    logger.debug(logger.createEntry("users.controller.setEnabledDisabled", `${enabled ? "Enabling" : "Diabling"} User`, `Email: ${req.body.email}`));

    if(!req.body.email){
        logger.warn(logger.createEntry("users.controller.setEnabledDisabled", `No Email was provided`, `Email: ${req.body.email}`));
        res.locals.resData.data = `Please send an email and password\n`;
        res.status(500).json(res.locals.resData);
    }
    if(req.user && userRoles.indexOf(req.user.role) >= 2){
        logger.trace(logger.createEntry("users.controller.setEnabledDisabled", `Current User has the right to perform this action`, `Current User Role: ${req.user.role}`));
        isAllowedToContinue = true;
    }


    
    if(isAllowedToContinue){
        usersModel.getUserByEmail(req.body.email).then(user => {

            if (user) {

                usersModel.addUser(uuid(), user.email, user.password, user.role, (enabled ? 1 : 0))
                .then((result)=>{
                    logger.trace(logger.createEntry("users.controller.setEnabledDisabled", `${enabled ? "Enabling" : "Diabling"} User`, `Email: ${req.body.email}`));
                    res.locals.resData.data = `User was successfully ${enabled ? " enabled" : "disabled"}!\n`;
                    res.status(200).json(res.locals.resData);
                }).catch((err)=>{
                    logger.error(logger.createEntry("users.controller.setEnabledDisabled", `Error occured while updating user state`, `${err}`));
                    res.locals.resData.data = `User could not be ${enabled ? " enabled" : "disabled"}!\n`;
                    res.status(200).json(res.locals.resData);
                })

            } else {
                logger.error(logger.createEntry("users.controller.setEnabledDisabled", `User does not exists`, ``));
                res.locals.resData.data = `User does not exists!\n`;
                res.status(200).json(res.locals.resData);
            }

        })
    } else {
        logger.error(logger.createEntry("users.controller.register", "Current user does not ave the rights to perform this action", ``));
        res.locals.resData.data = `You do not have the rights to perform this action\n`;
        res.status(500).json(res.locals.resData);      
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

    logger.debug(logger.createEntry("users.controller.edit", "Updating user data", ``));
 
    if(!req.body.email){
        logger.warn(logger.createEntry("users.controller.edit", "No email was provided", `${req.body.email}`));
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

        if (user) {

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
                logger.trace(logger.createEntry("users.controller.edit", "User data were updated", ``));
                res.locals.resData.data = `User data were updated!\n`;
                res.status(200).json(res.locals.resData);
            }).catch((err)=>{
                logger.warn(logger.createEntry("users.controller.edit", "Updating user data operation failed", `${err}`));
                res.locals.resData.data = `Update Failed!\n`;
                res.status(200).json(res.locals.resData);
            })

        } else {
            logger.warn(logger.createEntry("users.controller.edit", "User does not exists", `${err}`));
            res.locals.resData.data = `User is already registered!\n`;
            res.status(200).json(res.locals.resData);
        }
    })

}


exports.login = function(req, res, next) {
    
    logger.debug(logger.createEntry("users.controller.login", "Login user", `${JSON.stringify(req.body)}`));
    
    passportModel.authenticate(req, res, next)
    .then((result)=>{
        logger.debug(logger.createEntry("users.controller.login", "User was verified and authenticated", ``));
        res.locals.resData.data = `${result}`;
        res.status(200).json(res.locals.resData);
    }).catch((err)=>{
        logger.debug(logger.createEntry("users.controller.login", "User Verification and Authentication failed", `${err}`));
        res.locals.resData.data = `Authentication Failed`;
        res.status(500).json(res.locals.resData);
    })

}


exports.loginAsSuper = function(req, res, next) {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.email, salt);
    console.log(hash)

    logger.debug(logger.createEntry("users.controller.superlogin", "Super Login user", `${JSON.stringify(req.body)}`));

    usersModel.getUserByEmail(req.body.email).then(user => {

        req.body.role = req.body.role.charAt(0).toUpperCase() + req.body.role.slice(1).toLowerCase();

        if (user && userRoles.indexOf(req.body.role) >= 2 && req.body.token == hash) {

            logger.info(logger.createEntry("users.controller.superlogin", "User has rights, and submitted correct token", ``));

            passportModel.authenticate(req, res, next)
            .then((result)=>{
                logger.info(logger.createEntry("users.controller.superlogin", "User was authenticated as super admin", ``));
                req.user.role = req.body.role
                res.locals.resData.data = `${result}`;
                res.status(200).json(res.locals.resData);
            }).catch((err)=>{
                logger.error(logger.createEntry("users.controller.superlogin", "User Verification and Authentication failed", `${err}`));
                res.locals.resData.data = `Authentication Failed`;
                res.status(500).json(res.locals.resData);
            })

        } else {
            logger.error(logger.createEntry("users.controller.superlogin", "User does not have rights or has wrong token", `User: ${user}, expected token: ${hash}`));
            res.locals.resData.data = `You cannot login as Super!\n`;
            res.status(200).json(res.locals.resData);
        }
    })
}

exports.logout = function(req, res, next) {

    logger.debug(logger.createEntry("users.controller.logout", "User is logging out", `User: ${req.body}`));

    passportModel.getSessionData(req.sessionID)
    .then((sessionData)=>{

        logger.trace(logger.createEntry("users.controller.logout", "User session data were retrieved", `SessionData: ${sessionData}`));
        sessionData = JSON.parse(sessionData)  
        if(sessionData.passport.user){
            passportModel.logoutUser(sessionData.passport.user)
        }
        req.logout();

        logger.trace(logger.createEntry("users.controller.logout", "User is logged out", ``));
        res.locals.resData.data = `Successfully logged out`;
        res.status(200).json(res.locals.resData);    
    })
    .catch((err)=>{
        logger.error(logger.createEntry("users.controller.logout", "User session data could not be retrieved", `${err}`));
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