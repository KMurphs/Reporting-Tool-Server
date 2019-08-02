const dataModel = require("../models/data.model.js")
const errorUtils = require("../../common/config/error.utils.js")
exports.currentApiVersion = "v1";


const logger = require("../../common/config/winston.config.js").getLogger();



exports.getUnitResults = function(req, res) {
    
    let snSessions = [];

    dataModel.getUnitsHistory().then((data)=>{
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getUnitsResults(snSessions).then((data)=>{

            logger.info(createEntry("server.datacontroller.getunitsresults", "units results were succesffuly fetched from db", res.locals.reqData));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        }).catch((reason)=>{
            logger.warn(createEntry("server.datacontroller.getunitsresults", "units results fetch failed", res.locals.reqData));
        })
    
    })

}

exports.getUnitSummary = function(req, res) {
    
    let snSessions = [];

    dataModel.getUnitsHistory().then((data)=>{
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getUnitsSummaries(snSessions).then((data)=>{
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        })
    
    })

}


exports.getUnitsResults = function(req, res) {
    
    let snSessions = [];

    dataModel.getUnitsHistory().then((data)=>{
        logger.debug(logger.createEntry("data.controller.getunitresults.getunithistory", "Successfully fetched history", res.locals.reqData));
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getUnitsResults(snSessions).then((data)=>{
            logger.debug(logger.createEntry("data.controller.getunitresults.getunithistory.getbatchdata", "Successfully fetched results", res.locals.reqData));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        })
    
    })

}

exports.getUnitsSummaries = function(req, res) {
    
    let snSessions = [];

    dataModel.getUnitsHistory().then((data)=>{
        logger.debug(logger.createEntry("data.controller.getunitsummary.getunithistory", "Successfully fetched history", res.locals.reqData));
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getUnitsSummaries(snSessions).then((data)=>{
            logger.debug(logger.createEntry("data.controller.getunitsummary.getunithistory.getbatchdata", "Successfully fetched batch", res.locals.reqData));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        })
    
    })

}

exports.getBatchData = function(req, res) {
    
    let snSessions = [];

    dataModel.getUnitsHistory().then((data)=>{
        logger.debug(logger.createEntry("data.controller.getbatchdata.getunithistory", "Successfully fetched history", res.locals.reqData));
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getBatchData(snSessions).then((data)=>{
            logger.debug(logger.createEntry("data.controller.getbatchdata.getunithistory.getbatchdata", "Successfully fetched batch", res.locals.reqData));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        })
    
    })

}

exports.getUnitsHistory = function(req, res) {
    
    dataModel.getUnitsHistory().then((data)=>{
        logger.debug(logger.createEntry("data.controller.getunithistory", "Successfully fetched history", res.locals.reqData));
        res.locals.resData.data = data;
        res.status(200).json(res.locals.resData);
    })

}

exports.getAPI_currVersion_Endpoints = function(req, res) {
    
    const data = {
        endpoints: [
            "/data/api/v1/unitshistory",
            "/data/api/v1/batch",
            "/data/api/v1/unitssummaries",
            "/data/api/v1/unitsresults",
            "/data/api/v1/unitssummary/<Some Serial Number>",
            "/data/api/v1/unitsresults/<Some Serial Number>"
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