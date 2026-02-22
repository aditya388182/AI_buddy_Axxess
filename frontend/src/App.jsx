import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Page components
import Home from "./pages/Home";
import MainDashBoard from "./pages/MainDashBoard";
import Chat from "./pages/Chat";
import NurseConsultInterface from "./pages/NurseConsultInterface";
import EmrReport from "./pages/EmrReport";
import Profile from "./pages/Profile";

// Admin pages
import MedAndProtocal from "./pages/Admin/MedicationProtocol";
import PatientCommunication from "./pages/Admin/CommunicationHub";
import PatientDashboard from "./pages/Admin/SmartMonitorDashboard";

const App = () => {
  const [backendStatus, setBackendStatus] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5050/")
      .then((res) => setBackendStatus(res.data))
      .catch((err) => console.error("Backend fetch error:", err));
  }, []);

  return (
    <BrowserRouter>
      <div>
        {/* Optional: show backend status at top */}
        {backendStatus && (
          <div style={{ background: "#f0f0f0", padding: "8px" }}>
            Backend Status: {backendStatus}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<MainDashBoard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/consult" element={<NurseConsultInterface />} />
          <Route path="/reports" element={<EmrReport />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin pages */}
          <Route path="/admin/medandprotocal" element={<MedAndProtocal />} />
          <Route path="/admin/communication" element={<PatientCommunication />} />
          <Route path="/admin/dashboard" element={<PatientDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
