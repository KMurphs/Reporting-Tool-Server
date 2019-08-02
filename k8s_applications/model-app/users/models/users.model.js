const redis   = require("redis");
const redisClient  = redis.createClient();
const { redisGetHashMapByField } = require("../../common/config/redis.utils.js");






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

