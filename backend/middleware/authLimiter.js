import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
    
    //how long to remember the requests for
    windowMs : 60 * 1000,
    //no of requests per each window
    max : 5,
    //by adding this we are making the limiter based on ip + email
    keyGenerator: (req) => {
        const ip = ipKeyGenerator(req);
        const email = req.body.email || "anonymous";
        return `${ip}_${email}`;
    },

    message : {
        error : "Too Many requests",
        message : "Too Many login attempts. Try again later."
    },
    
    //helps in including RateLimit-* headers in the response so that client can know about the requests remaining
    standardHeaders : true,
    //Disables the older X-RateLimit-* headers to keep the response clean
    legacyHeaders : false
})