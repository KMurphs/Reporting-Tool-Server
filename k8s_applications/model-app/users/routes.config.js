// 
const usersController = require("./controllers/users.controller.js")

exports.processRequest = function(app) {
    app.post("/api/" + app.apiVersion + "/users/register", [
        usersController.register
    ])
    app.post("/api/" + app.apiVersion + "/users/login", [
        usersController.login
    ])
    app.post("/api/" + app.apiVersion + "/users/login/super", [
        usersController.loginAsSuper
    ])
    app.post("/api/" + app.apiVersion + "/users/logout", [
        usersController.logout
    ])
    app.post("/api/" + app.apiVersion + "/users/edit", [
        usersController.edit
    ])
    app.post("/api/" + app.apiVersion + "/users/enable", [
        usersController.setEnabled
    ])
    app.post("/api/" + app.apiVersion + "/users/disable", [
        usersController.setDisabled
    ])
    app.get("/api/" + app.apiVersion + "/users", [
        usersController.getEndpoints
    ])
    app.get("/api/" + app.apiVersion, [
        usersController.getAPI_versions
    ])
    app.get("/api/" + app.apiVersion + "/users/*", [
        usersController.InvalidEndPoint
    ])
}