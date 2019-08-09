const dataModel = require("../models/data.model.js")
const errorUtils = require("../../common/config/error.utils.js")
exports.currentApiVersion = "v1";


const logger = require("../../common/config/winston.config.js").getLogger();


exports.getOneUnitInstanceResults = function(req, res){
    
    let snSessions = [];
    logger.debug(logger.createEntry("data.controller.one.result.instances", "Get Units Results for Test Isntances", `Retrieving detailed results for units with sn ${req.params.id} and test instances ${req.query.inst ? req.query.inst.split(",") : []}`));

    dataModel.getUnitsHistory([req.params.id]).then((data)=>{

        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }

        logger.trace(logger.createEntry("data.controller.one.result.instances", "Got unit's ID", `Retrieved database id for units with sn ${req.params.id} - id ${JSON.stringify(snSessions[0])}`));
        
        dataModel.getUnitsInstanceResults(snSessions[0], req.query.inst ? req.query.inst.split(",") : []).then((data)=>{

            logger.trace(logger.createEntry("data.controller.one.result.instances", "units results were succesffuly fetched from db", res.locals.reqData));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        }).catch((reason)=>{
            logger.error(logger.createEntry("data.controller.one.result.instances", "REsults Fetch Failed", `${reason}`));
            res.locals.resData.data = 'Data Fetch Failed';
            res.status(500).json(res.locals.resData);
        })
    
    })

}


exports.getOneUnitResults = function(req, res) {
    
    let snSessions = [];
    logger.debug(logger.createEntry("data.controller.one.result", "Get One Units Results", `Retrieving detailed results for units with sn ${req.params.id}`));

    dataModel.getUnitsHistory([req.params.id]).then((data)=>{

        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }

        logger.trace(logger.createEntry("data.controller.one.result", "Got unit's ID", `Retrieved database id for units with sn ${req.params.id} - id ${JSON.stringify(snSessions)}`));
        
        dataModel.getUnitsResults(snSessions).then((data)=>{

            logger.trace(logger.createEntry("server.datacontroller.getunitsresults", "units results were succesffuly fetched from db", res.locals.reqData));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        }).catch((reason)=>{
            logger.error(logger.createEntry("server.datacontroller.getunitsresults", "REsults Fetch Failed", `${reason}`));
            res.locals.resData.data = 'Data Fetch Failed';
            res.status(500).json(res.locals.resData);
        })
    
    })

}

exports.getOneUnitSummary = function(req, res) {
    
    let snSessions = [];

    logger.debug(logger.createEntry("server.datacontroller.one.summary", "Getting one Unit's summary", `Obtaining summary for unit with summary ${req.params.id}`));

    dataModel.getUnitsHistory([req.params.id]).then((data)=>{
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }

        logger.trace(logger.createEntry("server.datacontroller.one.summary", "Retrieved Database ID", `Obtained database id for unit ${JSON.stringify(snSessions)}`));
        
        dataModel.getUnitsSummaries(snSessions).then((data)=>{
            logger.debug(logger.createEntry("server.datacontroller.one.summary", "Sending Summary", `Sending summary for unit ${req.params.id}`));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        }).catch((reason)=>{
            logger.error(logger.createEntry("server.datacontroller.one.summary", "Summary Fetch Failed", `${reason}`));
            res.locals.resData.data = 'Data Fetch Failed';
            res.status(500).json(res.locals.resData);
        })
    
    })

}


exports.getUnitsResults = function(req, res) {
    
    let snSessions = [];

    logger.debug(logger.createEntry("server.datacontroller.results", "Getting results data", `Obtaining results for units with id ${req.query.ids ? req.query.ids.split(",") : []}`));

    dataModel.getUnitsHistory(req.query.ids ? req.query.ids.split(",") : []).then((data)=>{
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getUnitsResults(snSessions).then((data)=>{
            logger.debug(logger.createEntry("data.controller.results", "Successfully fetched results", `units ${req.query.ids ? req.query.ids.split(",") : []}`));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        }).catch((reason)=>{
            logger.error(logger.createEntry("server.datacontroller.one.summary", "REsults Fetch Failed", `${reason}`));
            res.locals.resData.data = 'Data Fetch Failed';
            res.status(500).json(res.locals.resData);
        })
    
    })

}



exports.getUnitsSummaries = function(req, res) {
    
    let snSessions = [];

    logger.debug(logger.createEntry("server.datacontroller.summaries", "Getting summary data", `Obtaining summaries for units with id ${req.query.ids ? req.query.ids.split(",") : []}`));

    dataModel.getUnitsHistory(req.query.ids ? req.query.ids.split(",") : []).then((data)=>{
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getUnitsSummaries(snSessions).then((data)=>{
            logger.debug(logger.createEntry("server.datacontroller.summaries", "Successfully fetched summaries", `units ${req.query.ids ? req.query.ids.split(",") : []}`));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        }).catch((reason)=>{
            logger.error(logger.createEntry("server.datacontroller.summaries", "Summaries Fetch Failed", `${reason}`));
            res.locals.resData.data = 'Data Fetch Failed';
            res.status(500).json(res.locals.resData);
        })
    
    })

}

exports.getBatchData = function(req, res) {
    
    let snSessions = [];

    logger.debug(logger.createEntry("server.datacontroller.batch", "Getting batch data", `Obtaining batch for units with id ${req.query.ids ? req.query.ids.split(",") : []}`));

    dataModel.getUnitsHistory(req.body.units).then((data)=>{
        
        for(item in data){
            snSessions.push(data[item].TestSum_ID);
        }
        
        dataModel.getBatchData(snSessions).then((data)=>{
            logger.debug(logger.createEntry("server.datacontroller.batch", "Successfully fetched batch", `units ${req.query.ids ? req.query.ids.split(",") : []}`));
            res.locals.resData.data = data;
            res.status(200).json(res.locals.resData);
        }).catch((reason)=>{
            logger.error(logger.createEntry("server.datacontroller.batch", "Batch Fetch Failed", `${reason}`));
            res.locals.resData.data = 'Data Fetch Failed';
            res.status(500).json(res.locals.resData);
        })
    
    })

}

exports.getUnitsHistory = function(req, res) {

    logger.debug(logger.createEntry("data.controller.history", "Getting history data", `Obtaining history for all units`));
    
    dataModel.getUnitsHistory().then((data)=>{
        logger.debug(logger.createEntry("data.controller.history", "Successfully fetched history", ''));
        res.locals.resData.data = data;
        res.status(200).json(res.locals.resData);
    }).catch((reason)=>{
        logger.error(logger.createEntry("data.controller.history", "History Fetch Failed", `${reason}`));
        res.locals.resData.data = 'Data Fetch Failed';
        res.status(500).json(res.locals.resData);
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