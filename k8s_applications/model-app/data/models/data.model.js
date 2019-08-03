const mysql = require("mysql");
const config = require("../../common/config/env.config")


const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.msqlHost,
    user: config.msqlUser,
    password: config.msqlPassword,
    database: config.msqlDatabase
});



exports.getUnitsResults = function(snSessions) {

    //Query string template for database use. Note the placeholders (e.g xxTSIDxx) thta must be replaced by actual values before, the query can be used
    const aQuerystring = "SELECT test_results_table.Table_ID, test_results_table.Board_TestInstance, test_results_table.Test_TimeStamp, \
                            test_results_table.Test_Description, test_results_table.UUT_Configuration, test_results_table.TestBench_Configuration, test_results_table.Pass_Fail,\
                            test_results_table.LL_Extended, test_results_table.Lower_Limit, Measurement, test_results_table.Upper_Limit, test_results_table.UL_Extended, \
                            test_results_table.SI_Unit, test_results_table.Comments, test_results_table.Admin_Comments, \
                            CONCAT(test_summary_extended_table.Temperature_Status, ': ',test_summary_extended_table.TestSequence_Group, ': ', test_summary_extended_table.TestSequence_Description) as reportsection \
                    FROM test_schema.test_results_table \
                    JOIN test_schema.test_summary_extended_table\
                    ON (test_results_table.Board_TestInstance = test_summary_extended_table.Board_TestInstance AND test_results_table.Test_Summary_ID = test_summary_extended_table.Test_Summary_ID)\
                    WHERE test_results_table.Board_TestInstance in (SELECT Board_TestInstance  \
                                                                     FROM test_schema.test_summary_extended_table \
                                                                     WHERE Test_Summary_ID in (xxTSIDxx)) \
                    AND test_results_table.Test_Summary_ID = xxTSIDxx \
                    ORDER by Table_ID;";

    
    //Collecting an array of promises. One for each unit
    snPromises = [];
    for(const item in snSessions){
        snPromises.push(queryDB(aQuerystring.replace(new RegExp("xxTSIDxx", "g"), snSessions[item])))
    }   
    

    return new Promise(function(resolve, reject){
        //Awaiting the resolution of every unit in the array of promises and collecting data
        Promise.all(snPromises).then((unitsData)=>{
        
            let data = {}
            for(const idx in unitsData){
                data[snSessions[idx]] = unitsData[idx];
            }
            resolve(data)

        })        
    })

}


exports.getUnitsSummaries = function(snSessions) {

    //Query string template for database use. Note the placeholders (e.g xxTSIDxx) thta must be replaced by actual values before, the query can be used
    const aQuerystring = "SELECT CONCAT(Temperature_Status, ': ',TestSequence_Group, ': ', TestSequence_Description, ': ', Board_TestInstance) as itemID, \
                            Serial_Number, Test_Summary_ID, \
                            Temperature_Status, TestSequence_Group, TestSequence_Description, \
                            CONCAT(Temperature_Status, ': ',TestSequence_Group, ': ', TestSequence_Description) as reportsection, \
                            TestSequence_Pass_Fail, TestSequence_Group_Pass_Fail, Board_TestInstance  \
                        FROM test_schema.test_summary_extended_table \
                        WHERE Test_Summary_ID in (xxTSIDxx) \
                        ORDER by TestSum_Extended_ID;";

    
    //Collecting an array of promises. One for each unit
    snPromises = [];
    for(const item in snSessions){
        snPromises.push(queryDB(aQuerystring.replace(new RegExp("xxTSIDxx", "g"), snSessions[item])))
    }   
    

    return new Promise(function(resolve, reject){
        //Awaiting the resolution of every unit in the array of promises and collecting data
        Promise.all(snPromises).then((unitsData)=>{
        
            let data = {}
            for(const idx in unitsData){
                data[snSessions[idx]] = unitsData[idx];
            }
            resolve(data)

        })        
    })

}


exports.getBatchData = function(snSessions) {

    //Query string template for database use. Note the placeholders (e.g xxTSIDxx) thta must be replaced by actual values before, the query can be used
    const aQuerystring = "SELECT * from (SELECT TestSum_ID, Serial_Number, Final_Pass_Fail, Client_Name FROM test_schema.test_summary_table JOIN test_schema.clients_table ON test_schema.test_summary_table.Client_ID = test_schema.clients_table.Client_ID WHERE TestSum_ID = xxTSIDxx) AS table1 \
                            JOIN (SELECT (SELECT if(count(TestSequence_Group_Pass_Fail) > 0, 'FAIL', 'PASS') FROM test_schema.test_summary_extended_table WHERE Test_Summary_ID = xxTSIDxx AND TestSequence_Group_Pass_Fail = 'FAIL' AND Temperature_Status = 'Ambient') AS Ambient,  \
                                 (SELECT if(count(TestSequence_Group_Pass_Fail) > 0, 'FAIL', 'PASS') FROM test_schema.test_summary_extended_table WHERE Test_Summary_ID = xxTSIDxx AND TestSequence_Group_Pass_Fail = 'FAIL' AND Temperature_Status = 'Cold') AS Cold, \
                                 (SELECT if(count(TestSequence_Group_Pass_Fail) > 0, 'FAIL', 'PASS') FROM test_schema.test_summary_extended_table WHERE Test_Summary_ID = xxTSIDxx AND TestSequence_Group_Pass_Fail = 'FAIL' AND Temperature_Status = 'Hot') AS Hot) AS table2";
    

    let querystring= "";
    for(item in snSessions){
        querystring = querystring + " UNION " + aQuerystring.replace(new RegExp("xxTSIDxx", "g"), snSessions[item])
    }
    querystring = querystring.substr(6) + ";"


    return queryDB(querystring);
}


exports.getUnitsHistory = function(units) {

    let ids = "";
    if(units){
        for(let i = 0; i < units.length; i++){
            ids = ids + ", " + parseInt(units[i])
        }
        ids = ids.substr(2);    
    }

    const querystring = `SELECT TestSum_ID, Serial_Number, Log_TimeStamp as TimeStamp, Project_Code, Product_Description, Batch_ID, Client_Name \
                        FROM test_schema.test_summary_table \
                        JOIN test_schema.products_table \
                        ON test_summary_table.Product_ID = products_table.Product_ID \
                        JOIN test_schema.clients_table \
                        ON test_summary_table.Client_ID = clients_table.Client_ID \
                        xxWHERExx ORDER BY Serial_Number DESC, Log_TimeStamp DESC;`
    
    return queryDB(!units || units.length == 0 ? querystring.replace(new RegExp("xxWHERExx", "g"), ``) : querystring.replace(new RegExp("xxWHERExx", "g"), `WHERE Serial_Number in (${ids})`));
}


const queryDB = function(querystring){

    let data = {};

    return new Promise(function(resolve, reject) {

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

    })  

}