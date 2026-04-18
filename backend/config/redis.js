import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: process.env.REDIS_URL.includes("rediss://")
        ? { rejectUnauthorized: false }
        : undefined
});

connection.on("connect", () => {
    console.log("Connected to Redis");
})

connection.on("error", (err) => {
    console.error("Redis Error:", err);
})

export default connection;