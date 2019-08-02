
exports.createError = function(errCode, errName, errMsg){
	let error = new Error(errMsg);
	error.name = errName;
	error.statusCode = errCode;
	error.timestamp = new Date().getTime()

	throw error;
}
