import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [uid, setUid] = useState("");

  /* ================= COMMON POST LOGIN ================= */
  const postLogin = async (uid) => {
    const userSnap = await getDoc(doc(db, "users", uid));

    if (!userSnap.exists()) {
      throw new Error("User profile not found");
    }

    const data = userSnap.data();

    // Alumni verification check
    if (data.role === "alumni") {
      const alumniSnap = await getDoc(doc(db, "alumni_profiles", uid));
      if (alumniSnap.exists() && alumniSnap.data().verified === false) {
        throw new Error("Alumni account not verified by college");
      }
    }

    setUserRole(data.role);
    setUid(uid);
    setShowDialog(true);
  };

  /* ================= EMAIL LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await postLogin(res.user.uid);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      await postLogin(res.user.uid);
    } catch (err) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONFIRM ================= */
  const handleConfirm = () => {
    setShowDialog(false);

    if (userRole === "student") navigate("/dashboard/student");
    else if (userRole === "alumni") navigate("/dashboard/alumni");
    else if (userRole === "college") navigate("/dashboard/college");
    else navigate("/");
  };

  /* ================= UI ================= */
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h4 className="text-center fw-bold mb-3">Login</h4>
              <p className="text-center text-muted mb-4">
                Access your AlumniConnect account
              </p>

              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}

              {/* GOOGLE LOGIN */}
              <button
                type="button"
                className="btn btn-outline-dark w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  width="18"
                />
                Continue with Google
              </button>

              <div className="text-center text-muted mb-3">OR</div>

              {/* EMAIL LOGIN */}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Don’t have an account? <a href="/signup">Sign Up</a>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= CONFIRMATION DIALOG ================= */}
      {showDialog && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Confirm Login</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowDialog(false)}
                  />
                </div>

                <div className="modal-body">
                  <p>Login successful!</p>
                  <p>
                    You are logging in as <strong>{userRole}</strong>.
                  </p>
                  <p>Do you want to continue?</p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleConfirm}
                  >
                    Yes, Continue
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
