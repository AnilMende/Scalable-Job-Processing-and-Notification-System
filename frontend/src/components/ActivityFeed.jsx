import { motion } from "framer-motion";

const ActivityFeed = ({ activities }) => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-4 h-75 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Live Activity</h2>

            <div className="space-y-2">
                {
                    activities.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-2 rounded-lg bg-gray-50 text-sm"
                        >
                            <span className="font-mono">{item.jobId}</span>
                            {" → "}
                            <span
                                className={`font-semibold ${item.status === "completed"
                                        ? "text-green-600"
                                        : item.status === "failed"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                    }`}
                            >
                                {item.status}
                            </span>
                        </motion.div>
                    ))
                }
            </div>
        </div>
    )
}

export default ActivityFeed;