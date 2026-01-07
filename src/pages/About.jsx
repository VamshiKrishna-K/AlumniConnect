import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container py-5 min-vh-100">

      {/* HEADER */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">About AlumniConnect</h1>
        <p className="text-muted mt-3">
          Building meaningful connections between students, alumni, and institutions
        </p>
      </div>

      {/* ABOUT CONTENT */}
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">

          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">

              <h4 className="fw-bold mb-3">What is AlumniConnect?</h4>
              <p className="text-muted">
                AlumniConnect is a web-based platform designed to strengthen the relationship
                between students and alumni of educational institutions. The platform enables
                students to explore alumni profiles, understand career paths, and seek professional
                guidance in a structured and secure manner.
              </p>

              <h4 className="fw-bold mt-4 mb-3">Our Vision</h4>
              <p className="text-muted">
                Our vision is to create a trusted digital ecosystem where institutions, alumni,
                and students collaborate to support career growth, mentorship, and professional
                development.
              </p>

              <h4 className="fw-bold mt-4 mb-3">How It Works</h4>
              <ul className="text-muted">
                <li>Students create profiles highlighting their academic background and skills</li>
                <li>Alumni register and share professional experience</li>
                <li>Colleges verify alumni to maintain authenticity</li>
                <li>Students can request referrals and mentorship from verified alumni</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">Why AlumniConnect?</h4>
              <p className="text-muted">
                AlumniConnect focuses on transparency, trust, and ease of use. By involving
                institutions in the verification process, the platform ensures reliable connections
                and meaningful professional interactions.
              </p>

              {/* CTA */}
              <div className="text-center mt-5">
                <Link to="/register" className="btn btn-primary px-4">
                  Get Started
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
