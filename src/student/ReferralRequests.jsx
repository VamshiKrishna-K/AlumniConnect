import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

export default function ReferralRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        // 1️⃣ Get referral requests made by this student
        const q = query(
          collection(db, "referral_requests"),
          where("studentId", "==", uid)
        );

        const snap = await getDocs(q);

        // 2️⃣ Enrich with alumni details
        const data = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const req = docSnap.data();

            const alumniUserSnap = await getDoc(
              doc(db, "users", req.alumniId)
            );

            const alumniProfileSnap = await getDoc(
              doc(db, "alumni_profiles", req.alumniId)
            );

            return {
              id: docSnap.id,
              message: req.message,
              status: req.status,
              createdAt: req.createdAt?.toDate().toLocaleDateString(),
              alumniName: alumniUserSnap.exists()
                ? alumniUserSnap.data().name
                : "—",
              company: alumniProfileSnap.exists()
                ? alumniProfileSnap.data().company
                : "—",
              designation: alumniProfileSnap.exists()
                ? alumniProfileSnap.data().designation
                : "—"
            };
          })
        );

        setRequests(data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getBadge = (status) => {
    if (status === "accepted") return "success";
    if (status === "rejected") return "danger";
    return "warning";
  };

  return (
    <div className="container mt-5  min-vh-100">
      <h4 className="fw-bold mb-4">My Referral Requests</h4>

      {loading ? (
        <p>Loading referral requests...</p>
      ) : requests.length === 0 ? (
        <div className="alert alert-info">
          You have not sent any referral requests.
        </div>
      ) : (
        <div className="row">
          {requests.map((req) => (
            <div key={req.id} className="col-md-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">

                  <h6 className="fw-bold">
                    {req.alumniName}
                  </h6>

                  <p className="mb-1">
                    <strong>Company:</strong> {req.company}
                  </p>

                  <p className="mb-1">
                    <strong>Designation:</strong> {req.designation}
                  </p>

                  <p className="mt-2">
                    <strong>Message:</strong><br />
                    {req.message}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span
                      className={`badge bg-${getBadge(req.status)}`}
                    >
                      {req.status.toUpperCase()}
                    </span>

                    <small className="text-muted">
                      {req.createdAt}
                    </small>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
