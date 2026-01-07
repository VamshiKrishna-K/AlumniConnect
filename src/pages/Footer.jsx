export default function Footer() {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-5 border-top">
      <div className="container">
        <div className="row">

          {/* Left */}
          <div className="col-md-6 text-md-start text-center mb-2 mb-md-0">
            © {new Date().getFullYear()} <strong>AlumniConnect</strong>
          </div>

          {/* Right */}
          <div className="col-md-6 text-md-end text-center">
            <span>Connecting Students & Alumni</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
