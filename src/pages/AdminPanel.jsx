// src/pages/AdminPanel.jsx

import { useEffect, useState } from "react";
import { getReports, updateReportStatus, deleteReport } from "../services/api";

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleStatusChange = async (id, status) => {
    const res = await updateReportStatus(id, status);
    setReports((prev) =>
      prev.map((r) => (r._id === id ? res.data.report : r))
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Admin: Delete this report?")) return;
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r._id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

      {message && <p className="text-center">{message}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div
            key={r._id}
            className="bg-white p-4 rounded-lg shadow border relative"
          >
            

            <h3 className="font-bold text-lg">{r.description}</h3>

            {r.imageUrl && (
              <img
                src={`http://localhost:5000${r.imageUrl}`}
                className="w-full h-40 object-cover rounded mt-2"
                alt="issue"
              />
            )}

            <p><strong>Type:</strong> {r.type}</p>

            {r.address && <p><strong>Address:</strong> {r.address}</p>}

            <p><strong>Status:</strong> {r.status}</p>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleStatusChange(r._id, "open")}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Open
              </button>
              <button
                onClick={() => handleStatusChange(r._id, "in progress")}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange(r._id, "resolved")}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Resolved
              </button>
            </div>
            <button
              onClick={() => handleDelete(r._id)}
              className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
