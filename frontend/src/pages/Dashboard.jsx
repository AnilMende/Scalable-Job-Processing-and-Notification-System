
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket.js";

import toast from "react-hot-toast";
import Charts from "../components/Charts.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import StatCard from "../components/StatCard.jsx";

const Dashboard = () => {

    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0
    });


    const [activities, setActivities] = useState([]);
    const [statusHistory, setStatusHistory] = useState([]);

    const [throughput, setThroughPut] = useState(0);

    const prevStatsRef = useRef({
        completed: 0,
        time: Date.now()
    })


    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGYzNjFkZDJkMDU3ODlhMzZkZmM0OSIsImlhdCI6MTc3NzIzMDMwNSwiZXhwIjoxNzc3MjMzOTA1fQ.x0Nn9nDaEFWQAf1wJLetkbsbjim37LUCM3wvXEzkcWI"

    // Fetch stats
    const fetchStats = async () => {
        const res = await axios.get("http://localhost:5000/api/jobs/queue-stats", {
            headers:
            {
                Authorization: `Bearer ${token}`
            }
        });

        const data = res.data.data;

        setStats(data);

        // Throughput Calculation
        const now = Date.now();

        const prev = prevStatsRef.current;

        const deltaJobs = data.completed - prev.completed;

        const deltaTime = (now - prev.time) / 1000; //seconds

        const jobsPerSec = deltaTime > 0 ? deltaJobs / deltaTime : 0;

        setThroughPut(jobsPerSec.toFixed(2));

        // update reference
        prevStatsRef.current = {
            completed: data.completed,
            time: now
        };

        // push into history (important for chart)
        setStatusHistory(prev => [
            ...prev.slice(-15),
            {
                time: new Date().toLocaleTimeString(),
                completed: data.completed,
                failed: data.failed,
                throughput: jobsPerSec
            }
        ]);
    };

    // Fetch Jobs from DB
    const fetchJobs = async () => {
        const res = await axios.get("http://localhost:5000/api/jobs/all-jobs", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const formatted = res.data.data.map(j => ({
            jobId: String(j._id),
            status: j.status
        }));

        setJobs(formatted);
    }

    // Create job
    const createJob = async () => {
        try {
            //console.log("Creating job...");

            const res = await axios.post(
                "http://localhost:5000/api/jobs/create-job",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // console.log("API Response:", res.data);

            const jobId = String(res.data.data._id);

            // UI update on job creation
            setJobs(prev => [
                { jobId, status: "pending" },
                ...prev
            ]);

            setActivities(prev => [
                { jobId, status: "pending" },
                ...prev.slice(0, 9)
            ]);

            toast.success("Job created successfully");

            fetchStats();

        } catch (error) {
            console.error(error);
            toast.error("Failed to create job");
        }
    };

    useEffect(() => {
        fetchStats();
        fetchJobs();

        // AUTO REFRESH
        const interval = setInterval(() => {
            fetchStats();
        }, 2000); // every 2 seconds

        // SOCKET LISTENER
        socket.on("job-update", (data) => {

            const incomingId = String(data.jobId);

            // Update jobs
            setJobs((prev) => {
                const exists = prev.find(j => j.jobId === incomingId);

                if (exists) {
                    return prev.map(j =>
                        j.jobId === incomingId
                            ? { ...j, status: data.status }
                            : j
                    );
                } else {
                    return [{ jobId: incomingId, status: data.status }, ...prev];
                }
            });

            // Activity Feed
            setActivities(prev => [
                { jobId: incomingId, status: data.status },
                ...prev.slice(0, 9)
            ]);

        });

        return () => {
            socket.off("job-update");
            clearInterval(interval);
        };

    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Job Processing Dashboard</h1>

                <div className="flex items-center gap-3">
                    <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-gray-500">System Live</span>
                </div>

                <button
                    onClick={createJob}
                    className="bg-linear-to-r from-blue-600 to-indigo-600 
               text-white px-5 py-2 rounded-xl 
               shadow hover:scale-105 active:scale-95 
               transition duration-200 mb-6 cursor-pointer"
                >
                    + Create Job
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <StatCard title="Waiting" value={stats?.waiting} />
                <StatCard title="Active" value={stats?.active} />
                <StatCard title="Completed" value={stats?.completed} />
                <StatCard title="Failed" value={stats?.failed} />
                <StatCard title="Throughput" value={`${throughput} /s`} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                    <Charts stats={stats} statusHistory={statusHistory} />
                </div>

                <ActivityFeed activities={activities} />
            </div>

            {/* Job Table */}
            <div className="bg-white shadow rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Job ID</th>
                            <th className="text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center py-6 text-gray-400">
                                    No jobs yet
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr
                                    key={job.jobId}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-mono">
                                        {job.jobId.slice(-10)}
                                    </td>
                                    <td>
                                        <StatusBadge status={job.status} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Dashboard;