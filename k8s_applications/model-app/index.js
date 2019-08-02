const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const appRoot = require('app-root-path');
const winston = require('winston');
const uuid = require('uuid/v4')
const session = require('express-session')
const redis   = require("redis");
const redisClient  = redis.createClient();
const redisStore = require('connect-redis')(session);

const logger = require('./common/config/winston.config').init(appRoot, winston)
const config = require("./common/config/env.config")
const DataRouter = require("./data/routes.config")
const UsersRouter = require("./users/routes.config")
const { redisGetHashMapByField } = require("./common/config/redis.utils.js");
const { passportInit } = require("./users/models/passport.model.js");

process.env.VERSION = "1.0.1"
process.env.APPNAME = "model application"

const enableDebug = true;



app.logger = logger;
app.apiVersion = "v1";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    genid: (req) => {
        return uuid() 
    },
    store: new redisStore({ 
        host: 'localhost', 
        port: 6379, 
        client: redisClient, 
        ttl:  260
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
passportInit(app)

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

    res.locals.reqData = "'/" + req.method + "' at '"  + req.url + "' with '" + JSON.stringify(req.body) + "'";
    res.locals.resData = {
        appVersion: process.env.VERSION,
        appName: process.env.APPNAME, 
        data: {}
    }
    
    console.log(res.locals.reqData)
    // console.log(app.apiVersion)

    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});


UsersRouter.processRequest(app)
DataRouter.processRequest(app)


// error handler
app.use(function(err, req, res, next) { 

    const logEntry = logger.createEntry("general.error.handler", err, res.locals.reqData)
    logger.error(logEntry);

    let msg = {
        message: err.message,
        name: err.name,
    }

    res.status(err.statusCode || 500).json((process.env.NODE_ENV !== 'production'? logEntry : msg));
});

app.listen(config.port, function() {
    console.log("API Server Listening at Port: " + config.port);
})