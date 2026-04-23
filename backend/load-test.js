import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

const sucessRequests = new Counter("success_requests");
const throttledRequests = new Counter("throttled_requests");

export const options = {
    scenarios: {
        job_load_test: {
            executor: "ramping-vus",
            startVUs: 1,
            stages: [
                { duration: "10s", target: 10 },
                { duration: "20s", target: 20 },
            ]
        }
    }
};

const BASE_URL = "http://localhost:5000/api/jobs";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGYzNjFkZDJkMDU3ODlhMzZkZmM0OSIsImlhdCI6MTc3Njk0NTE4MiwiZXhwIjoxNzc2OTQ4NzgyfQ.jo3QNDiOQGS-usnG6OaNl7Itl-ahq34lXmK0NxOlJDc";

export default function () {

    const params = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
    };

    const res = http.post(`${BASE_URL}/create-job`, {}, params);

    check(res, {
        "status is 200 or 201 (success)": (r) =>
            r.status === 200 || r.status === 201,

        "status is 429 (throttled)": (r) =>
            r.status === 429,
    });

    if (res.status !== 200 && res.status !== 201 && res.status !== 429) {
        console.log("Unexpected status:", res.status);
    }

    //updating success and throttled counter based on the status
    if (res.status === 200 || res.status === 201) {
        sucessRequests.add(1);
    } else if (res.status === 429) {
        throttledRequests.add(1);
    }


    sleep(0.5); // simulate user delay
}

