
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket.js";
import StatusBadge from "./StatusBadge.jsx";
import toast from "react-hot-toast";


const Dashboard = () => {

    const StatCard = ({ title, value }) => (
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    );

    const showToast = (msg) => {
        toast.success(msg, {
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff"
            }
        })
    };


    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0
    });


    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGYzNjFkZDJkMDU3ODlhMzZkZmM0OSIsImlhdCI6MTc3NzEwMDk1MCwiZXhwIjoxNzc3MTA0NTUwfQ.6SJfiYhzdhN5l1j5itG_71PbR7TtETc1B2MItcm1-SM"

    // Fetch stats
    const fetchStats = async () => {
        const res = await axios.get("http://localhost:5000/api/jobs/queue-stats", {
            headers:
            {
                Authorization: `Bearer ${token}`
            }
        });
        setStats(res.data.data);
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
            console.log("Creating job...");

            const res = await axios.post(
                "http://localhost:5000/api/jobs/create-job",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("API Response:", res.data);

            const jobId = String(res.data.data._id);

            // ✅ IMMEDIATE UI update
            setJobs(prev => [
                { jobId, status: "pending" },
                ...prev
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

        socket.on("job-update", (data) => {
            console.log("Live:", data);

            // Update jobs
            setJobs((prev) => {
                const incomingId = String(data.jobId);

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

            fetchStats();
        });

        return () => socket.off("job-update");
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Job Processing Dashboard</h1>

                <button
                    onClick={createJob}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
                >
                    + Create Job
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Waiting" value={stats.waiting} />
                <StatCard title="Active" value={stats.active} />
                <StatCard title="Completed" value={stats.completed} />
                <StatCard title="Failed" value={stats.failed} />
            </div>

            {/* Job Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Job ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.map((job) => (
                            <tr
                                key={job.jobId}
                                className="border-b hover:bg-gray-50 transition duration-200"
                            >
                                <td className="p-4 font-mono text-sm text-gray-700">
                                    {job.jobId}
                                </td>

                                <td>
                                    <StatusBadge status={job.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {jobs.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        No jobs yet. Create one to start 🚀
                    </div>
                )}
            </div>

        </div>
    );
}

export default Dashboard;