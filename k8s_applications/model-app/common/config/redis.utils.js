const redisClient  = require("redis").createClient();

module.exports.redisGetHashMapByField = function(hashPattern, fieldName, fieldValue){

  return new Promise(function(resolve, reject){

    redisClient.keys(hashPattern, async function (err, items) {

        if(err) reject(err)

        let i;
        for(i = 0; i < items.length; i++) {

            await new Promise(function(resolve, reject){  
                redisClient.hgetall(items[i], function(err, itemData){

                    if(err) reject(err)
                    if(itemData[fieldName] == fieldValue)
                        resolve(itemData);
                    resolve();
                })                     
            }).then(res => { if(res) resolve(res) }).catch(err => reject(err))

        }

        if(i == items.length)
            resolve()
    
    });
  })  
}