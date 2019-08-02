
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const redis   = require("redis");

const config = require("../../common/config/env.config")
const redisClient  = redis.createClient({host : config.redisHost, port : config.redisPort});
const { redisGetHashMapByField } = require("../../common/config/redis.utils.js");


module.exports.passportInit = function(app){
   passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            await redisGetHashMapByField("user:*", "email", email).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Invalid credentials.\n' });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: 'Invalid credentials.\n' });
                }
                return done(null, user);
            })
            .catch(error => done(error));
        }
    ));

    passport.serializeUser((user, done) => {
        //Ensure that when the user is first serialized (associated with a session)
        //We also create a authenticated user in the user database.
        //This will help the other deployments to get the authenticated status of a user
        //Also the this authenticated user entry is set to expire.
        //The expiration will be reset everytime the user performs an action against this model server
        persistUserAuthentication(`${user.id}`);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        //Ensure that when the user is first serialized (associated with a session)
        //We also create a authenticated user in the user database.
        //This will help the other deployments to get the authenticated status of a user
        //Also the this authenticated user entry is set to expire.
        //The expiration will be reset everytime the user performs an action against this model server
        persistUserAuthentication(`${id}`)
        redisClient.hgetall(`user:${id}`, function (err, obj) {
            done(null, obj)
        });
    });
    
    app.use(passport.initialize()) 
    app.use(passport.session()) 
}



module.exports.getSessionData = function(sessionID){
    return new Promise((resolve, reject) => {

        redisClient.get(`sess:${sessionID}`, function(err, foundSession){
            if(err) reject(err)
            else resolve(foundSession)
        })

    })
}


module.exports.authenticate = function(req, res, next){
    return new Promise((resolve, reject) => {

        passport.authenticate('local', (err, user, info) => {
            if(info) reject(info.message);
            if(err)  reject(err);
            if(!user)reject("Invalid User") 
            
            req.login(user, (err) => {
                if(err) reject(err) 
                resolve('User is authenticated')
            })
        })(req, res, next);       

    })
}
   

persistUserAuthentication = function(userID) {
    const authPersistence = 120;

    return new Promise((resolve, reject) => {

        redisClient.hgetall(`authuser:${userID}`, function(err, foundUser){
            console.log(foundUser)
            if(foundUser){
                redisClient.expire(`authuser:${userID}`,  authPersistence, function(err, result){
                    if(err) reject(err)
                    else resolve(result)
                });
            }else{
                redisClient.hmset(`authuser:${userID}`, "authTime", (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':'), function (err, result) {
                    if(err) 
                        reject(err)
                    else {
                        redisClient.expire(`authuser:${userID}`,  authPersistence, function(err, result){
                            if(err) reject(err)
                            else resolve(result)
                        });
                    }
                });               
            }
        })

    })
}

module.exports.logoutUser = function(userID) {

    return new Promise((resolve, reject) => {

        redisClient.expire(`authuser:${userID}`,  0, function(err, result){
            if(err) reject(err)
            else resolve(result)
        });

    })
}