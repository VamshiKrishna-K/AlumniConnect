import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Navbar() {
   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  // ===== LOGOUT =====
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light " style={{ backgroundColor: "#e7f1ff" }}>
      <div className="container">
        {/* Brand (optional – remove if you want even this on right) */}
        <img
          src={logo}
          alt="AlumniConnect Logo"
          height="40"
          className="d-inline-block "
        />
        <Link
          className="navbar-brand fw-bold"
          style={{ color: "SlateBlue"}} to="/" >
          AlumniConnect
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Right aligned menu */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item ms-2">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>

            <li className="nav-item ms-2">
              <Link className="nav-link" to="/signUp">
                SignUp
              </Link>
            </li>
            <li>
               {/* Logout Button */}
      <button
        className="btn"
        onClick={() => setShowLogoutDialog(true)}
      >
        Logout
      </button>

            </li>
          </ul>
        </div>
      </div>
      {/* ===== CONFIRM LOGOUT DIALOG ===== */}
      {showLogoutDialog && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Confirm Logout</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowLogoutDialog(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <p>Are you sure you want to logout?</p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowLogoutDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    Yes, Logout
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </nav>
  );
}
