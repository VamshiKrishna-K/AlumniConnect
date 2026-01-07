import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AlumniDashboard() {
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  const [alumni, setAlumni] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!uid) return;

      // Alumni basic info
      const userSnap = await getDoc(doc(db, "users", uid));
      if (userSnap.exists()) setAlumni(userSnap.data());

      // Alumni profile
      const profileSnap = await getDoc(
        doc(db, "alumni_profiles", uid)
      );
      if (profileSnap.exists()) setProfile(profileSnap.data());

      // Referral requests
      const q = query(
        collection(db, "referral_requests"),
        where("alumniId", "==", uid)
      );

      const reqSnap = await getDocs(q);

      const reqData = await Promise.all(
        reqSnap.docs.map(async (r) => {
          const studentSnap = await getDoc(
            doc(db, "users", r.data().studentId)
          );

          return {
            id: r.id,
            message: r.data().message,
            status: r.data().status,
            createdAt: r.data().createdAt
              ?.toDate()
              .toLocaleDateString(),
            studentName: studentSnap.exists()
              ? studentSnap.data().name
              : "Student"
          };
        })
      );

      setRequests(reqData);
    };

    loadData();
  }, [uid]);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "referral_requests", id), {
      status
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    );
  };

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* ===== SIDEBAR ===== */}
      <div
        className="p-3 text-black"
        style={{ width: "240px", backgroundColor: "#e7f1ff" }}
      >
        <h4 className="fw-bold mb-4">🎓 AlumniConnect</h4>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <span className="nav-link text-black fw-semibold">
              Dashboard
            </span>
          </li>

          <li className="nav-item">
            <span
              className="nav-link text-black"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/alumni-profile")}
            >
              Edit Profile
            </span>
          </li>
        </ul>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow-1 p-4">

        {/* ===== TOP PROFILE HEADER ===== */}
        <div className="card shadow-sm mb-4">
          <div className="card-body text-center">

            <img
              src={
                profile?.profileImage ||
                "https://via.placeholder.com/160?text=Profile"
              }
              alt="Profile"
              className="rounded-circle shadow mb-3"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "cover",
                border: "4px solid #0d6efd",
              }}
            />

            <h5 className="fw-bold mb-1">{alumni?.name}</h5>
            <p className="text-muted mb-1">{alumni?.email}</p>

            <span
              className={`badge ${
                profile?.verified ? "bg-success" : "bg-warning"
              }`}
            >
              {profile?.verified ? "Verified Alumni" : "Verification Pending"}
            </span>

            <div className="mt-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate("/alumni-profile")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ===== PROFILE SUMMARY ===== */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <small className="text-muted">Company</small>
                <h6>{profile?.company || "-"}</h6>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <small className="text-muted">Designation</small>
                <h6>{profile?.designation || "-"}</h6>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <small className="text-muted">Verification Status</small>
                <h6
                  className={
                    profile?.verified
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {profile?.verified ? "Verified" : "Pending"}
                </h6>
              </div>
            </div>
          </div>
        </div>

        {/* ===== REFERRAL REQUESTS ===== */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Referral Requests</h5>

            {requests.length === 0 ? (
              <p className="text-muted">
                No referral requests received.
              </p>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="border rounded p-3 mb-3"
                >
                  <p className="mb-1">
                    <strong>Student:</strong> {req.studentName}
                  </p>

                  <p className="mb-1">
                    <strong>Message:</strong><br />
                    {req.message}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="badge bg-warning">
                      {req.status.toUpperCase()}
                    </span>

                    {req.status === "pending" && (
                      <div>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() =>
                            updateStatus(req.id, "accepted")
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            updateStatus(req.id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
