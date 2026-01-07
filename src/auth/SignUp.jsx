import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function SignUp() {
  const navigate = useNavigate();

  /* ================= STEP ================= */
  const [step, setStep] = useState(1);

  /* ================= AUTH DATA ================= */
  const [uid, setUid] = useState(null);
  const [authProvider, setAuthProvider] = useState("");

  /* ================= BASIC ================= */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ================= PROFILE ================= */
  const [role, setRole] = useState("");
  const [collegeId, setCollegeId] = useState("");

  const [rollNo, setRollNo] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD COLLEGES ================= */
  useEffect(() => {
    const fetchColleges = async () => {
      const snap = await getDocs(collection(db, "colleges"));
      setColleges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchColleges();
  }, []);

  /* ================= EMAIL AUTH (STEP 1) ================= */
  const handleEmailNext = async () => {
    if (!name || !email || !password) {
      setError("Fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUid(res.user.uid);
      setAuthProvider("password");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE AUTH (STEP 1) ================= */
  const handleGoogleNext = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      setUid(res.user.uid);
      setName(res.user.displayName || "");
      setEmail(res.user.email || "");
      setAuthProvider("google");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FINAL SAVE (STEP 2) ================= */
  const handleFinishSignup = async () => {
    if (!role || !collegeId) {
      setError("Select role and college");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // USERS
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role,
        collegeId,
        authProvider,
      });

      // ALUMNI
      if (role === "alumni") {
        await setDoc(doc(db, "alumni_profiles", uid), {
          rollNo,
          company,
          designation,
          collegeId,
          verified: false,
        });
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
  <div className="row justify-content-center w-100">
    
    {/* Increased width here */}
    <div className="col-md-6 col-lg-5">
      <div className="card shadow-lg border-0 rounded-4">
        
        {/* Increased padding here */}
        <div className="card-body p-5">

          <h4 className="text-center fw-bold mb-3">
            {step === 1 ? "Create Account" : "Complete Profile"}
          </h4>

          <p className="text-center text-muted mb-4">
            {step === 1
              ? "Sign up to continue"
              : "Choose your role and college"}
          </p>

          {error && (
            <div className="alert alert-danger text-center">
              {error}
            </div>
          )}

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              <input
                className="form-control form-control-lg mb-3"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                className="form-control form-control-lg mb-3"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="form-control form-control-lg mb-4"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="btn btn-primary btn-lg w-100 mb-3"
                onClick={handleEmailNext}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Next"}
              </button>

              <div className="text-center text-muted mb-3">OR</div>

              <button
                type="button"
                className="btn btn-outline-dark btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleGoogleNext}
                disabled={loading}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  width="18"
                />
                Continue with Google
              </button>
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <select
                className="form-select form-select-lg mb-3"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>

              <select
                className="form-select form-select-lg mb-3"
                onChange={(e) => setCollegeId(e.target.value)}
              >
                <option value="">Select College</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.CollegeName}
                  </option>
                ))}
              </select>

              {role === "alumni" && (
                <div className="bg-light rounded-3 p-3 mb-3">
                  <input
                    className="form-control mb-2"
                    placeholder="Roll No"
                    onChange={(e) => setRollNo(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Company"
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <input
                    className="form-control"
                    placeholder="Designation"
                    onChange={(e) => setDesignation(e.target.value)}
                  />

                  <div className="alert alert-warning small text-center mt-3 mb-0">
                    Alumni accounts require college verification
                  </div>
                </div>
              )}

              <button
                className="btn btn-success btn-lg w-100"
                onClick={handleFinishSignup}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Finish Signup"}
              </button>
            </>
          )}

        </div>
      </div>
    </div>

  </div>
</div>

  );
}
