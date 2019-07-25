const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const mysql = require("mysql");

const config = require("./common/config/env.config")
const version = "1.0.0"
const name = "node application"

const enableDebug = true;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(function(req, res, next) {
    if(enableDebug){
        const temp = "\nServer Received\n" + req.method + " request at: " + req.url + "\nRequest body: " + JSON.stringify(req.body)
        console.log(temp)
        fs.writeFile("temp.txt", temp, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });
    }
    return next();
});



app.get("/version", (req, res) =>{
    res.status(404).json({
        version: version,
        name: name
    })
})


app.listen(config.port, function() {
    console.log("API Server Listening at Port: " + config.port)
})