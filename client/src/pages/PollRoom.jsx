import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import api from "../api.js";


const socket = io("http://localhost:5000");

const PollRoom = () => {
    const { id } = useParams();

    const [poll, setPoll] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Generate voterId (Fairness Mechanism #1)
    const getVoterId = () => {
        let voterId = localStorage.getItem("voterId");

        if (!voterId) {
            voterId = "voter_" + Math.random().toString(36).substring(2, 10);
            localStorage.setItem("voterId", voterId);
        }

        return voterId;
    };

    // Fetch Poll + Setup Socket
    useEffect(() => {
        const getPoll = async () => {
            const { data } = await api.get(`/polls/${id}`)
            setPoll(data);

        }
        getPoll();

        // Join socket room
        socket.emit("joinPoll", id);

        // Listen for live updates
        socket.on("pollUpdated", (updatedPoll) => {
            setPoll(updatedPoll);
        });

        return () => {
            socket.off("pollUpdated");
        };
    }, [id]);

    // Voting Handler
    const vote = async (optionIndex) => {
        try {
            const voterId = getVoterId();
            const res = await api.post(
                `/polls/vote/${id}`,
                {
                    optionIndex,
                    voterId,
                }
            );

            // Axios automatically parses JSON
            const data = res.data;

            setHasVoted(true);
            setMessage("Thanks for voting!");

        } catch (error) {

            if (error.response) {
                // Server responded with error (like 400, 500)
                setHasVoted(true);
                setMessage("Something went wrong: " + error.response.data.message);
            } else {
                // Network error
                setHasVoted(true);
                setMessage("Network error. Please try again.");
            }
        }
    };

    if (!poll) return <h2 className="text-center mt-10">Loading Poll...</h2>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
                {/* Poll Question */}
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {poll.question}
                </h1>

                {/* Message */}
                {message && (
                    <div className="mb-4 p-3 rounded-xl bg-gray-100 text-center font-semibold">
                        {message}
                    </div>
                )}

                {/* Options */}
                <div className="space-y-4">
                    {poll.options.map((opt, index) => (
                        <button
                            key={index}
                            onClick={() => vote(index)}
                            disabled={hasVoted}
                            className={`w-full flex justify-between items-center p-4 rounded-xl border 
              ${hasVoted
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "hover:bg-black hover:text-white"
                                }`}
                        >
                            <span>{opt.text}</span>
                            <span className="font-bold">{opt.votes}</span>
                        </button>
                    ))}
                </div>

                {/* Poll room link */}
                <div className="mt-6 text-center">
                    <p className="font-semibold">Share this poll:</p>
                    <p className="text-blue-600 underline">
                        {window.location.href}
                    </p>
                </div>

                {/* Already Voted Banner */}
                {hasVoted && (
                    <p className="text-center mt-6 text-sm text-gray-600">
                        You can only vote once in this poll.
                    </p>
                )}
            </div>
        </div>
    );
}

export default PollRoom;
