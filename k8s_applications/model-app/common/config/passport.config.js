const redisClient  = require("redis").createClient();
{ redisGetHashMapByField } = require("redis.utils.js");

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        await redisGetHashMapByField("user:*", "email", email).then(res => {
            const user = res
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
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    redisClient.hgetall(`user:${id}`, function (err, obj) {
        done(null, obj)
    });
});