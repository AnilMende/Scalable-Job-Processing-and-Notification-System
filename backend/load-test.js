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
                { duration: "30s", target: 50 }, // Ramp up to 50
                { duration: "1m", target: 100 },  // Ramp up to 100
                { duration: "30s", target: 0 },
            ]
        }
    }
};

const BASE_URL = "http://localhost:5000/api/jobs";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGYzNjFkZDJkMDU3ODlhMzZkZmM0OSIsImlhdCI6MTc3NzAxODYwOCwiZXhwIjoxNzc3MDIyMjA4fQ.BdW7jOquyVAyBk_RAi8kj1UHybzoBq4ZL2HFDYbAjUQ";

export default function () {

    const params = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
    };

    const res = http.post(`${BASE_URL}/create-job`, {}, params);

    check(res, {
        "request succeeded": (r) =>
            r.status === 200 || r.status === 201 || r.status === 429,
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

