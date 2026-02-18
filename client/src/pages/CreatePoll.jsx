import { useState } from "react";
import api from "../api.js";
import { Link, Navigate } from "react-router-dom";

const CreatePoll = () => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [shareLink, setShareLink] = useState("");

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    // Create poll api
    const createPoll = async () => {
        setShareLink("");

        if (!question.trim()) {
            alert("Please enter a poll question.");
            return;
        }
        // remove empty options
        const filteredOptions = options.filter((opt) => opt.trim() !== "");

        if (filteredOptions.length < 2) {
            alert("Please enter at least 2 valid options.");
            return;
        }

        try {
            const res = await api.post("/polls/create", {
                question,
                options: filteredOptions,
            });

            const data = res.data;
            // setShareLink(`http://localhost:5173${data.shareLink}`);
            setShareLink(`https://real-time-poll-beta.vercel.app${data.shareLink}`);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Create a New Poll
                </h1>

                <input
                    type="text"
                    placeholder="Enter your poll question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 border rounded-xl mb-4"
                />

                <h2 className="font-semibold mb-2">Options:</h2>

                {options.map((opt, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full p-3 border rounded-xl mb-3"
                    />
                ))}

                <button
                    onClick={addOption}
                    className="w-full py-2 rounded-xl border mb-4 hover:bg-gray-100"
                >
                    + Add Another Option
                </button>

                <button
                    onClick={createPoll}
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90"
                >
                    Create Poll
                </button>

                <div>
                    <Link className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 mt-4" to={"/"}>← Go to Dashboard</Link>
                </div>

                {shareLink && (
                    <div className="mt-5 p-3 bg-green-100 rounded-xl text-center">
                        <p className="font-semibold">Share this link:</p>
                        <a
                            href={shareLink}
                            className="text-blue-600 underline break-all"
                        >
                            {shareLink}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreatePoll;