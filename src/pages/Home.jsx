import { Link } from "react-router-dom";
import logoAlumniConnect from "../assets/logoalumniconnect.png";

export default function Home() {
  return (
    <div className="min-vh-100 bg-light">

      {/* ================= HERO SECTION ================= */}
      <div className="container py-5">
        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-md-6">
            <h1 className="fw-bold mb-3">
              Welcome to AlumniConnect
            </h1>

            <p className="text-muted mb-4">
              A trusted platform that connects students with verified alumni
              for career guidance, referrals, and professional growth.
            </p>

            <div className="d-flex gap-3">
              <Link to="/signup" className="btn btn-primary px-4">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-secondary px-4">
                Login
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-md-6 text-center">
            <img
              src={logoAlumniConnect}
              alt="AlumniConnect Logo"
              className="img-fluid"
              style={{ maxHeight: "300px" }}
            />
          </div>

        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why AlumniConnect?</h2>
          <p className="text-muted">
            Built to create trusted academic and professional connections
          </p>
        </div>

        <div className="row text-center">

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="fw-bold">Verified Alumni</h5>
                <p className="text-muted mb-0">
                  Alumni profiles are verified by colleges to ensure
                  authenticity and trust.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="fw-bold">Referral Requests</h5>
                <p className="text-muted mb-0">
                  Students can request referrals directly from alumni
                  working in reputed organizations.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="fw-bold">College Controlled</h5>
                <p className="text-muted mb-0">
                  Colleges manage and verify alumni to maintain
                  a trusted network.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

     

    </div>
  );
}
