import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export default function VerifiedAlumni() {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAlumniId, setActiveAlumniId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVerifiedAlumni = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const studentSnap = await getDoc(doc(db, "users", uid));
      const collegeId = studentSnap.data().collegeId;

      const q = query(
        collection(db, "users"),
        where("role", "==", "alumni"),
        where("collegeId", "==", collegeId)
      );

      const usersSnap = await getDocs(q);

      const verified = await Promise.all(
        usersSnap.docs.map(async (u) => {
          const p = await getDoc(doc(db, "alumni_profiles", u.id));
          return p.exists() && p.data().verified
            ? { uid: u.id, name: u.data().name, ...p.data() }
            : null;
        })
      );

      setAlumniList(verified.filter(Boolean));
      setLoading(false);
    };

    fetchVerifiedAlumni();
  }, []);

  // 🔹 Submit referral request
  const submitReferral = async (alumniId) => {
    if (!message.trim()) return alert("Enter message");

    await addDoc(collection(db, "referral_requests"), {
      studentId: auth.currentUser.uid,
      alumniId,
      message,
      status: "pending",
      createdAt: serverTimestamp()
    });

    setMessage("");
    setActiveAlumniId(null);
  
  };

  return (
    <div className="container mt-5  min-vh-100">
      <h4 className="fw-bold mb-4">Verified Alumni</h4>

      {loading ? (
        <p>Loading...</p>
      ) : alumniList.length === 0 ? (
        <div className="alert alert-warning">
          No verified alumni found
        </div>
      ) : (
        <div className="row">
          {alumniList.map((alumni) => (
            <div key={alumni.uid} className="col-md-6 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">

                  <h5 className="fw-bold">{alumni.name}</h5>
                  <p className="mb-1">
                    <strong>Company:</strong> {alumni.company}
                  </p>
                  <p className="mb-2">
                    <strong>Designation:</strong> {alumni.designation}
                  </p>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      setActiveAlumniId(
                        activeAlumniId === alumni.uid
                          ? null
                          : alumni.uid
                      )
                    }
                  >
                    Request Referral
                  </button>

                  {/* 🔽 REFERRAL FORM */}
                  {activeAlumniId === alumni.uid && (
                    <div className="mt-3 border-top pt-3">
                      <textarea
                        className="form-control mb-2"
                        rows="3"
                        placeholder="Write a brief referral request..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => submitReferral(alumni.uid)}
                      >
                        Send Request
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
