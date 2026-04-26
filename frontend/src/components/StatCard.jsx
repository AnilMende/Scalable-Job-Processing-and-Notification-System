

const StatCard = ({ title, value }) => {
    return (
         <div className="bg-white/70 backdrop-blur-md border border-gray-200 
                        shadow-sm rounded-2xl p-4 hover:shadow-md transition duration-300">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-2xl font-bold mt-1">{value ?? 0}</h2>
        </div>
    )
}

export default StatCard;