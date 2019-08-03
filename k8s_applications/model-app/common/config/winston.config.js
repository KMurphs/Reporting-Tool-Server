// Usage


// https://www.npmjs.com/package/winston
// https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels



// Trace - Only when I would be "tracing" the code and trying to find one part of a function specifically.
// Debug - Information that is diagnostically helpful to people more than just developers (IT, sysadmins, etc.).
// Info - Generally useful information to log (service start/stop, configuration assumptions, etc). Info I want 
// 		to always have available but usually don't care about under normal circumstances. This is my out-of-the-box config level.
// Warn - Anything that can potentially cause application oddities, but for which I am automatically recovering. 
// 		(Such as switching from a primary to backup server, retrying an operation, missing secondary data, etc.)
// Error - Any error which is fatal to the operation, but not the service or application (can't open a 
// 		required file, missing data, etc.). These errors will force user (administrator, or direct user) intervention. 
// 		These are usually reserved (in my apps) for incorrect connection strings, missing services, etc.
// Fatal - Any error that is forcing a shutdown of the service or application to prevent data loss (or further data loss). 
// 		I reserve these only for the most heinous errors and situations where there is guaranteed to have been data corruption or loss.




// trace are built as problems are discovered and troubleshooting is happening
// debug gives feddback of - what operation the app (controllers) has started and 
//                         - when the operation is completed
// info Generally useful information to log (service start/stop, configuration assumptions, etc). Info I want 
//              to always have available but usually don't care about under normal circumstances.
// warn when something isn't what it's supposed to be
// error when operation has failed prematurely
// critical when app needs to stop






// const appRoot = require('app-root-path');
// const winston = require('winston');
// const logger = require('../common/winston.config').init(appRoot, winston)
// const createEntry = require('../common/winston.config').createEntry


// logger.error(logger.createEntry("general.error.handler", err, res.locals.reqData));
// logger.warn(logger.createEntry("some.namespace", "Some warning", res.locals.reqData));
// logger.info(logger.createEntry("some.namespace", "Some useful info", res.locals.reqData));
// logger.verbose(logger.createEntry("some.namespace", "Some verbose about some operation", res.locals.reqData));
// logger.debug(logger.createEntry("some.namespace", "Some debugging message", res.locals.reqData));
// logger.silly(logger.createEntry("some.namespace", "Some silly note", res.locals.reqData));

// Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
const customLogLevels = {
  	levels: {
    	fatal: 0,
    	error: 1,
    	warn: 2,
    	info: 3,
    	debug: 4,
    	trace: 5
  	},
  	colors: {
    	fatal: 'magenta',
    	error: 'red',
    	warn: 'yellow',
    	info: 'blue',
    	debug: 'white',
    	trace: 'gray',
  	}
};

let logger;

module.exports.getLogger = function(){
	return logger;
} 

module.exports.init = function(appRoot, winston){
	// define the custom settings for each transport (file, console)
	const options = {
  		file: {
    		level: process.env.LOG_LEVEL_FILE || "info",
    		filename: `${appRoot}/logs/app.log`,
    		handleExceptions: true,
    		json: true,
    		maxsize: 5242880, // 5MB
    		maxFiles: 5,
    		colorize: false,
  		},
  		console: {
    		level: process.env.LOG_LEVEL_CONSOLE || "debug",
    		handleExceptions: true,
    		json: false,
    		colorize: true,
  		},
	};

	winston.addColors(customLogLevels.colors);
	const colorizer = winston.format.colorize();
	
	// instantiate a new Winston Logger with the settings defined above
	logger = winston.createLogger({
  		level: 'trace',
  		format: winston.format.combine(
    		winston.format.timestamp(),
    		winston.format.simple(),
    		// winston.format.printf( msg => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.namespace} - ${msg.request} - ${(JSON.stringify(msg.message)).substr(0, 500)}...`))
        winston.format.printf( msg => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.namespace} - ${msg.request} \n\t${(JSON.stringify(msg.message))}\n\n`))
    	),
  		transports: [
    		new winston.transports.File(options.file),
    		new winston.transports.Console(options.console)
  		],
  		exitOnError: false, // do not exit on handled exceptions
  		levels: customLogLevels.levels
	});

	// create a stream object with a 'write' function that will be used by `morgan`
	logger.stream = {
  		write: function(message, encoding) {
    		// use the 'info' log level so the output will be picked up by both transports (file and console)
    		logger.info(message);
  		},
	};

	logger.createEntry = function(logNamespace, logMsg_error, reqData){

		let logEntry = {
			timestamp: new Date().getTime(),
			namespace: logNamespace,
			request: reqData
		}

		if(typeof(logMsg_error) == "object"){
			logEntry["message"] = {
				error: logMsg_error.toString(),
				stack: logMsg_error.stack
			}
		} else {
			logEntry["message"] = logMsg_error
		}
	
		return logEntry
	}

	return logger;
};





