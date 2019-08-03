module.exports = {
    "appPort": process.env.PORT || 5001,
    "appHost": process.env.IP || "127.0.0.1",

    "redisPort": process.env.REDIS_PORT || 6379,
    "redisHost": process.env.REDIS_DB_HOST || "127.0.0.1",
    "redisPassword": process.env.REDIS_DB_PASSWORD || "52F6F45612444B372B117DCCDC45A",

    "mysqlPort": process.env.MYSQL_PORT || 3306,
    "msqlUser": process.env.MYSQL_DB_USER || "tester",
    "msqlHost": process.env.MYSQL_DB_HOST || "127.0.0.1",
    "msqlDatabase":  process.env.MYSQL_DB_NAME || "test_schema",
    "msqlPassword": process.env.MYSQL_DB_PASSWORD || "Tester321!"
}