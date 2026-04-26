import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const Charts = ({ statusHistory, stats }) => {

    const pieData = [
        { name: "Completed", value: stats.completed || 0 },
        { name: "Failed", value: stats.failed || 0 }
    ];

    console.log("Pie Data:", pieData);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Jobs/sec Line Chart */}
            <div className="bg-white shadow-lg rounded-2xl p-4">
                <h2 className="text-lg font-semibold mb-3">Jobs Throughput</h2>

                <LineChart width={400} height={200} data={statusHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    
                    <Line type="monotone" dataKey="completed" stroke="#22c55e" />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" />
                    <Line type="monotone" dataKey="throughput" stroke="#3b82f6" />
                </LineChart>
            </div>

            {/* Success vs Failure */}
            <div className="bg-white shadow-lg rounded-2xl p-4">
                <h2 className="text-lg font-semibold mb-3">Success vs Failed</h2>

                {
                    stats.completed === 0 && stats.failed === 0 ? (
                        <p className="text-gray-400 text-sm text-center mt-10">No job data yet</p>
                    ) : (
                        <PieChart width={300} height={200}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                label
                            >
                                <Cell fill="#22c55e" />
                                <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    )
                }
            </div>

        </div>
    )
}

export default Charts;