import { BrowserRouter, Routes, Route } from "react-router-dom";
import PollRoom from "./pages/PollRoom";
import CreatePoll from "./pages/CreatePoll";
import PollDashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PollDashboard />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
