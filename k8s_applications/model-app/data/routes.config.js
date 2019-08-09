// 
const dataController = require("./controllers/data.controller.js")

exports.processRequest = function(app) {
    app.get("/api/" + app.apiVersion + "/data/unitresults/:id", [
        dataController.getOneUnitResults
    ])
    app.get("/api/" + app.apiVersion + "/data/unitresults/:id/instances/", [
        dataController.getOneUnitInstanceResults
    ])
    app.get("/api/" + app.apiVersion + "/data/unitsummary/:id", [
        dataController.getOneUnitSummary
    ])
    app.get("/api/" + app.apiVersion + "/data/unitresults", [
        dataController.getUnitsResults
    ])
    app.get("/api/" + app.apiVersion + "/data/unitsummary", [
        dataController.getUnitsSummaries
    ])
    app.get("/api/" + app.apiVersion + "/data/batch", [
        dataController.getBatchData //
    ])
    app.get("/api/" + app.apiVersion + "/data/units", [
        dataController.getUnitsHistory //
    ])
    app.get("/api/" + app.apiVersion, [
        dataController.getAPI_currVersion_Endpoints
    ])
    app.get("/api/data", [
        dataController.getAPI_versions
    ])
    app.get("/api/" + app.apiVersion + "/data/*", [
        dataController.InvalidEndPoint
    ])
}