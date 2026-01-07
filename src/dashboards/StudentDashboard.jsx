import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [collegeName, setCollegeName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      // User data
      const userSnap = await getDoc(doc(db, "users", uid));
      if (!userSnap.exists()) return;
      const user = userSnap.data();
      setStudent(user);

      // Student profile
      const profileSnap = await getDoc(doc(db, "student_profiles", uid));
      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
      }

      // College
      const collegeSnap = await getDoc(
        doc(db, "colleges", user.collegeId)
      );
      if (collegeSnap.exists()) {
        setCollegeName(collegeSnap.data().CollegeName);
      }
    };

    loadData();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* ===== SIDEBAR ===== */}
      <div
        className="text-black p-3"
        style={{ width: "240px", backgroundColor: "#e7f1ff" }}
      >
        <h4 className="fw-bold mb-4">🎓 AlumniConnect</h4>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <span
              className="nav-link text-black"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              Edit Profile
            </span>
          </li>

          <li className="nav-item">
            <span
              className="nav-link text-black"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/referrals")}
            >
              Referral Requests
            </span>
          </li>

          <li className="nav-item">
            <span
              className="nav-link text-black"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/verified_alumni")}
            >
              Verified Alumni
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

            <h5 className="fw-bold mb-1">{student?.name}</h5>
            <p className="text-muted mb-2">{student?.email}</p>

           
          </div>
        </div>

        {/* ===== SUMMARY CARDS ===== */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <small className="text-muted">College</small>
                <h6 className="fw-semibold">{collegeName}</h6>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <small className="text-muted">Profile Status</small>
                <h6 className={profile ? "text-success" : "text-danger"}>
                  {profile ? "Completed" : "Incomplete"}
                </h6>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <small className="text-muted">Academic Year</small>
                <h6>{profile?.year || "-"}</h6>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PROFILE DETAILS ===== */}
        <div className="card shadow-sm">
          <div className="card-body">

            <h5 className="fw-bold mb-3">My Profile Details</h5>

            <div className="row mb-2">
              <div className="col-md-6">
                <strong>Branch:</strong>{" "}
                {profile?.branch || "-"}
              </div>
              <div className="col-md-6">
                <strong>Year:</strong>{" "}
                {profile?.year || "-"}
              </div>
            </div>

            <div className="mb-3">
              <strong>Skills:</strong><br />
              {profile?.skills ? (
                profile.skills.split(",").map((skill, i) => (
                  <span
                    key={i}
                    className="badge bg-secondary me-2 mt-1"
                  >
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <span className="text-muted">No skills added</span>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
