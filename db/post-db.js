const Queue = require("bull");

const postQueue = new Queue("post", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
});

module.exports = { postQueue };
