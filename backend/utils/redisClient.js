import { createClient } from "redis";

const redisClient = createClient({
    url : process.env.REDIS_URL,

    socket : {
        tls : true,
        rejectUnauthorized : false,
        servername : new URL(process.env.REDIS_URL).hostname,
        connectTimeout : 10000
    }
})

redisClient.on("error", (err) => {
    console.log("error", err);
})

await redisClient.connect();

console.log("Connected to Redis");

export default redisClient;