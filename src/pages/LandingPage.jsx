import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LandingPage = () => {
  const { user } = useAuthStore();

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            💰 MCC Finance Planner
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#screenshots">Screenshots</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#download">Download</a>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary ms-2" to="/login">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section bg-gradient text-white py-5" style={{ paddingTop: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container text-center">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6 mx-auto">
              <div className="hero-logo mb-4">
                <span style={{ fontSize: '4rem' }}>💰</span>
              </div>
              <h1 className="display-4 fw-bold mb-4">
                Track Your Money.<br />
                <span className="text-warning">Stay in Control.</span>
              </h1>
              <p className="lead mb-5">
                Simple, powerful, and secure personal finance management. 
                Track expenses, manage budgets, and achieve your financial goals 
                with our cross-platform desktop and web application.
              </p>
              
              {/* Download Buttons */}
              <div className="download-buttons mb-4">
                <div className="row g-3 justify-content-center">
                  <div className="col-auto">
                    <button className="btn btn-light btn-lg px-4">
                      <i className="fab fa-windows me-2"></i>
                      Download for Windows
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="btn btn-light btn-lg px-4">
                      <i className="fab fa-apple me-2"></i>
                      Download for macOS
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="btn btn-light btn-lg px-4">
                      <i className="fab fa-linux me-2"></i>
                      Download for Linux
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    🌐 Try in Browser
                  </Link>
                </div>
              </div>
              
              <p className="text-light">
                <small>Free • Open Source • Cross-Platform</small>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Why Choose MCC Finance Planner?</h2>
            <p className="lead text-muted">Everything you need to manage your personal finances</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <span style={{ fontSize: '3rem' }}>💰</span>
                  </div>
                  <h5 className="card-title">Track Income & Expenses</h5>
                  <p className="card-text text-muted">
                    Easily categorize and monitor all your financial transactions 
                    with our intuitive interface.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <span style={{ fontSize: '3rem' }}>📊</span>
                  </div>
                  <h5 className="card-title">Visual Reports & Insights</h5>
                  <p className="card-text text-muted">
                    Beautiful charts and detailed reports help you understand 
                    your spending patterns and financial trends.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <span style={{ fontSize: '3rem' }}>🔄</span>
                  </div>
                  <h5 className="card-title">Import/Export Data</h5>
                  <p className="card-text text-muted">
                    Support for Excel, CSV, and JSON formats. Easily migrate 
                    from other financial apps or create backups.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <span style={{ fontSize: '3rem' }}>☁️</span>
                  </div>
                  <h5 className="card-title">Cloud Sync</h5>
                  <p className="card-text text-muted">
                    Secure Firebase integration keeps your data synchronized 
                    across all your devices automatically.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <span style={{ fontSize: '3rem' }}>🔒</span>
                  </div>
                  <h5 className="card-title">Secure & Private</h5>
                  <p className="card-text text-muted">
                    Your financial data is encrypted and isolated per user. 
                    We never see or sell your personal information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <span style={{ fontSize: '3rem' }}>🌙</span>
                  </div>
                  <h5 className="card-title">Dark/Light Mode</h5>
                  <p className="card-text text-muted">
                    Choose between beautiful dark and light themes that 
                    adapt to your preferences and time of day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">See It In Action</h2>
            <p className="lead text-muted">Preview the clean, intuitive interface</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow">
                <div className="card-body p-0">
                  <div className="screenshot-placeholder bg-gradient text-white d-flex align-items-center justify-content-center" 
                       style={{ height: '300px', background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                    <div className="text-center">
                      <span style={{ fontSize: '4rem' }}>📊</span>
                      <h5 className="mt-2">Dashboard</h5>
                      <p className="small">Balance overview & recent transactions</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent text-center">
                  <strong>Financial Dashboard</strong>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card border-0 shadow">
                <div className="card-body p-0">
                  <div className="screenshot-placeholder bg-gradient text-white d-flex align-items-center justify-content-center" 
                       style={{ height: '300px', background: 'linear-gradient(45deg, #f093fb, #f5576c)' }}>
                    <div className="text-center">
                      <span style={{ fontSize: '4rem' }}>📈</span>
                      <h5 className="mt-2">Reports</h5>
                      <p className="small">Charts & analytics</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent text-center">
                  <strong>Visual Reports</strong>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card border-0 shadow">
                <div className="card-body p-0">
                  <div className="screenshot-placeholder bg-gradient text-white d-flex align-items-center justify-content-center" 
                       style={{ height: '300px', background: 'linear-gradient(45deg, #4facfe, #00f2fe)' }}>
                    <div className="text-center">
                      <span style={{ fontSize: '4rem' }}>💳</span>
                      <h5 className="mt-2">Transactions</h5>
                      <p className="small">Easy expense tracking</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent text-center">
                  <strong>Transaction Management</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Why Our Users Love It</h2>
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="text-center">
                    <span style={{ fontSize: '2.5rem' }}>📱</span>
                    <h5 className="mt-2">Cross-Platform</h5>
                    <p className="small">Works on Windows, macOS, Linux, and web browsers</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-center">
                    <span style={{ fontSize: '2.5rem' }}>⚡</span>
                    <h5 className="mt-2">Lightning Fast</h5>
                    <p className="small">Offline-first design with cloud sync when online</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-center">
                    <span style={{ fontSize: '2.5rem' }}>🎨</span>
                    <h5 className="mt-2">Beautiful UI</h5>
                    <p className="small">Clean, modern interface that's joy to use daily</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-center">
                    <span style={{ fontSize: '2.5rem' }}>🔓</span>
                    <h5 className="mt-2">Open Source</h5>
                    <p className="small">Transparent, community-driven development</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="bg-white text-dark rounded p-4 shadow">
                <h5 className="fw-bold">What Users Say</h5>
                <div className="testimonial mb-3">
                  <p className="fst-italic">"Finally, a finance app that doesn't feel overwhelming. The clean interface helps me actually stay on top of my expenses!"</p>
                  <small className="text-muted">— Sarah M., Freelancer</small>
                </div>
                <div className="testimonial mb-3">
                  <p className="fst-italic">"Love the cross-platform support. I can track expenses on my laptop and check balances on my phone seamlessly."</p>
                  <small className="text-muted">— David L., Software Engineer</small>
                </div>
                <div className="testimonial">
                  <p className="fst-italic">"The Excel import feature saved me hours when migrating from my old spreadsheet system."</p>
                  <small className="text-muted">— Emma R., Small Business Owner</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section id="download" className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="lead mb-5">Download MCC Finance Planner and start your journey to better financial health today.</p>
          
          <div className="row g-3 justify-content-center mb-4">
            <div className="col-auto">
              <button className="btn btn-primary btn-lg px-5">
                <i className="fab fa-windows me-2"></i>
                Windows
                <br />
                <small>Download .exe</small>
              </button>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary btn-lg px-5">
                <i className="fab fa-apple me-2"></i>
                macOS
                <br />
                <small>Download .dmg</small>
              </button>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary btn-lg px-5">
                <i className="fab fa-linux me-2"></i>
                Linux
                <br />
                <small>Download .AppImage</small>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <Link to="/login" className="btn btn-outline-primary btn-lg me-3">
              🌐 Try Web Version
            </Link>
            <a href="https://github.com/michael-mpj/MCC-Finance-Planner" className="btn btn-outline-secondary btn-lg">
              <i className="fab fa-github me-2"></i>
              View Source Code
            </a>
          </div>
          
          <p className="text-muted">
            <small>Version 0.2.0 • Free & Open Source • Available Now</small>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>💰 MCC Finance Planner</h5>
              <p className="text-muted">
                Simple, powerful personal finance management for everyone.
              </p>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-6">
                  <h6>Product</h6>
                  <ul className="list-unstyled">
                    <li><a href="#features" className="text-muted text-decoration-none">Features</a></li>
                    <li><a href="#download" className="text-muted text-decoration-none">Download</a></li>
                    <li><Link to="/login" className="text-muted text-decoration-none">Try Online</Link></li>
                  </ul>
                </div>
                <div className="col-sm-6">
                  <h6>Support</h6>
                  <ul className="list-unstyled">
                    <li><a href="https://github.com/michael-mpj/MCC-Finance-Planner/issues" className="text-muted text-decoration-none">Report Bug</a></li>
                    <li><a href="https://github.com/michael-mpj/MCC-Finance-Planner" className="text-muted text-decoration-none">GitHub</a></li>
                    <li><a href="https://github.com/michael-mpj/MCC-Finance-Planner/wiki" className="text-muted text-decoration-none">Documentation</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-muted">
                © 2025 MCC Finance Planner. Open Source Software.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link to="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</Link>
              <Link to="/terms" className="text-muted text-decoration-none me-3">Terms of Service</Link>
              <a href="https://github.com/michael-mpj/MCC-Finance-Planner/issues" className="text-muted text-decoration-none">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;