import { motion } from "framer-motion";

const ActivityFeed = ({ activities }) => {
    return (

        <div className="bg-white rounded-2xl shadow p-4 h-[300px] overflow-y-auto">
            <h2 className="font-semibold mb-3">Live Activity</h2>

            {activities.length === 0 ? (
                <p className="text-gray-400 text-sm">No activity yet</p>
            ) : (
                activities.map((act, i) => (
                    <div
                        key={i}
                        className="flex justify-between text-sm border-b py-2 animate-fadeIn"
                    >
                        <span className="font-mono">{act.jobId.slice(-6)}</span>
                        <span className={
                            act.status === "completed"
                                ? "text-green-600"
                                : act.status === "failed"
                                    ? "text-red-500"
                                    : "text-yellow-500"
                        }>
                            {act.status}
                        </span>
                    </div>
                ))
            )}
        </div>
    )
}

export default ActivityFeed;