const redis   = require("redis");

const config = require("../../common/config/env.config")
const redisClient  = redis.createClient({host: config.redisHost, port: config.redisPort, password: config.redisPassword});
const { redisGetHashMapByField } = require("../../common/config/redis.utils.js");

const logger = require("../../common/config/winston.config.js").getLogger();




exports.addUser = function(userID, email, hashedPassword, role) {
    return new Promise((resolve, reject) => {
        redisClient.hmset(`user:${userID}`, "id", userID, "email", email, "password", hashedPassword, "role", role, "isEnabled", 1, function (err, result) {
            if(err) 
                reject(err)
            else 
                resolve(result)
        });
    })
}


exports.getUserByEmail = function(email) {
    return redisGetHashMapByField("user:*", "email", email)
}

