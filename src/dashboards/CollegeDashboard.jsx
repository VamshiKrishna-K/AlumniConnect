import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function CollegeDashboard() {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collegeName, setCollegeName] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedAlumniId, setSelectedAlumniId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const collegeUserUid = auth.currentUser?.uid;
        if (!collegeUserUid) return;

        // 1️⃣ Get logged-in college user
        const collegeUserSnap = await getDoc(
          doc(db, "users", collegeUserUid)
        );

        if (!collegeUserSnap.exists()) return;

        const collegeId = collegeUserSnap.data().collegeId;

        // 2️⃣ Get college name
        const collegeSnap = await getDoc(
          doc(db, "colleges", collegeId)
        );
        if (collegeSnap.exists()) {
          setCollegeName(collegeSnap.data().collegeName);
        }

        // 3️⃣ Fetch alumni users of this college
        const alumniQuery = query(
          collection(db, "users"),
          where("role", "==", "alumni"),
          where("collegeId", "==", collegeId)
        );

        const alumniUsersSnap = await getDocs(alumniQuery);

        // 4️⃣ Fetch alumni profiles
        const alumniData = await Promise.all(
          alumniUsersSnap.docs.map(async (userDoc) => {
            const profileSnap = await getDoc(
              doc(db, "alumni_profiles", userDoc.id)
            );

            return {
              uid: userDoc.id,
              ...userDoc.data(),
              profile: profileSnap.exists()
                ? profileSnap.data()
                : null
            };
          })
        );

        setAlumniList(alumniData);
      } catch (err) {
        console.error("Error loading alumni:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // ✅ Verify Alumni
  const verifyAlumni = async () => {
    try {
      await updateDoc(
        doc(db, "alumni_profiles", selectedAlumniId),
        { verified: true }
      );

      // Update UI
      setAlumniList((prev) =>
        prev.map((alumni) =>
          alumni.uid === selectedAlumniId
            ? {
                ...alumni,
                profile: { ...alumni.profile, verified: true }
              }
            : alumni
        )
      );

      setShowModal(false);
      setSuccessMessage("Alumni verified successfully.");
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-2">College Dashboard</h3>

      {collegeName && (
        <p className="text-muted mb-4">
          College: <strong>{collegeName}</strong>
        </p>
      )}

      <div className="alert alert-info">
        Verify alumni to make them visible to students.
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {loading ? (
        <p>Loading alumni...</p>
      ) : alumniList.length === 0 ? (
        <p className="text-muted">
          No alumni found for verification.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Roll No</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alumniList.map((alumni) => (
                <tr key={alumni.uid}>
                  <td>{alumni.name}</td>
                  <td>{alumni.email}</td>
                  <td>{alumni.profile?.company || "-"}</td>
                  <td>{alumni.profile?.designation || "-"}</td>
                  <td>{alumni.profile?.rollNo || "-"}</td>
                  <td>
                    {alumni.profile?.verified ? (
                      <span className="badge bg-success">
                        Verified
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    {!alumni.profile?.verified && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          setSelectedAlumniId(alumni.uid);
                          setShowModal(true);
                        }}
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔔 Confirmation Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Confirm Alumni Verification
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  Are you sure you want to verify this alumni?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={verifyAlumni}
                >
                  Yes, Verify
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
