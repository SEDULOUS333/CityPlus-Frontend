import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReports } from "../services/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      <div className="bg-white shadow-xl rounded-xl p-4 border">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Reported Issues Map
        </h1>

        <div className="w-full h-[450px] rounded-xl overflow-hidden">
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {reports.map((report) => (
              <Marker
                key={report._id}
                position={[
                  report.location.coordinates[1],
                  report.location.coordinates[0],
                ]}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-600">
                      TYPE: {report.type}
                    </p>

                    <p>{report.description}</p>

                    {report.imageUrl && (
                      <img
                        src={report.imageUrl}
                        alt="Issue"
                        className="mt-2 w-40 rounded-md"
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
