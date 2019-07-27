const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const mysql = require("mysql");

const config = require("./common/config/env.config")
const version = "1.0.1"
const name = "node application"

const enableDebug = true;


const temp = (process.env.MYSQL_DB_HOST) ? process.env.MYSQL_DB_HOST : "127.0.0.1";

const pool = mysql.createPool({
    connectionLimit: 5,
    host: (process.env.MYSQL_DB_HOST) ? process.env.MYSQL_DB_HOST : "127.0.0.1",
    user: (process.env.MYSQL_DB_USER) ? process.env.MYSQL_DB_USER : "tester",
    password: (process.env.MYSQL_DB_PASSWORD) ? process.env.MYSQL_DB_PASSWORD : "Tester321!",
    database: (process.env.MYSQL_DB_NAME) ? process.env.MYSQL_DB_NAME : "test_schema"
});

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
        const temp = "\nServer Received\n" + req.method + " request at: " + req.url + "\nRequest body: " + JSON.stringify(req.body) + "\n\n"
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
app.get("/units", async (req, res) => {

    const querystring = "SELECT * FROM test_schema.test_summary_table;"
    let data = {};

    await new Promise(function(resolve, reject) {

        pool.query(querystring, async function(err, rows, fields) {
            //Throw error if any
            if (err) {
                reject(err);
            }

            for (const row in rows) {
                if (!data[rows[row][fields[0].name]]) {
                    data[rows[row][fields[0].name]] = {}
                    for (const field in fields) {
                        data[rows[row][fields[0].name]][fields[field].name] = rows[row][fields[field].name]
                    }
                }
            }
            resolve(data)
        })

    }).then((data)=>{
        res.status(200).json(data)
    });  
})


app.listen(config.port, function() {
    console.log("API Server Listening at Port: " + config.port);
})