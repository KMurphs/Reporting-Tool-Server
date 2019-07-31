// 
const dataController = require("./controllers/data.controller.js")

exports.processRequest = function(app) {
    app.get("/data/api/" + dataController.currentApiVersion + "/unitresults/:id", [
        dataController.getUnitResults
    ])
    app.get("/data/api/" + dataController.currentApiVersion + "/unitsummary/:id", [
        dataController.getUnitSummary
    ])
    app.get("/data/api/" + dataController.currentApiVersion + "/unitresults", [
        dataController.getUnitsResults
    ])
    app.get("/data/api/" + dataController.currentApiVersion + "/unitsummary", [
        dataController.getUnitsSummaries
    ])
    app.get("/data/api/" + dataController.currentApiVersion + "/batch", [
        dataController.getBatchData
    ])
    app.get("/data/api/" + dataController.currentApiVersion + "/units", [
        dataController.getUnitsHistory
    ])
    app.get("/data/api/" + dataController.currentApiVersion, [
        dataController.getAPI_currVersion_Endpoints
    ])
    app.get("/data/api", [
        dataController.getAPI_versions
    ])
    app.get("/data", [
        dataController.InvalidEndPoint
    ])
    app.get("/data/*", [
        dataController.InvalidEndPoint
    ])
}