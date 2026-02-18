import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";



const PollDashboard = () => {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        const getPoll = async () => {
            const { data } = await api.get(`/polls`)
            setPolls(data);

        }
        getPoll();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                {/* {console.log(polls)} */}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">All Polls 🗳️</h1>

                    <Link
                        to="/create"
                        className="bg-black text-white px-4 py-2 rounded-xl"
                    >
                        + Create New Poll
                    </Link>
                </div>

                <div className="space-y-4">
                    {polls.length === 0 ? (
                        <p>No polls yet. Create your first poll!</p>
                    ) : (
                        polls.map((poll) => (
                            <Link
                                key={poll._id}
                                to={`/poll/${poll._id}`}
                                className="block p-4 bg-white shadow rounded-xl hover:bg-gray-100"
                            >
                                <h2 className="font-semibold">{poll.question}</h2>
                                <p className="text-sm text-gray-500">
                                    Options: {poll.options.length}
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default PollDashboard;