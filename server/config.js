var config = {
    port: 3000,
    secret: 'www.m&y^P^a&0/s?s!2228@#$!)_++~```',
    redisPort: 6379,
    redisHost: 'localhost',
    routes: {
        login: '/login',
        logout: '/logout',
        postService:'/post'
    }
};
module.exports = config;