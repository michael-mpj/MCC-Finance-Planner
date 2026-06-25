import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    authError,
    loginWithGoogle,
    loginWithEmail,
    signInDemo,
    clearError,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const result = await loginWithEmail(email, password);
    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    const result = await signInDemo();
    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <Link to="/" className="text-decoration-none">
                    <span style={{ fontSize: "3rem" }}>💰</span>
                    <h2 className="mt-2 mb-3 text-primary fw-bold">MCC Finance Planner</h2>
                  </Link>
                  <p className="text-muted">Sign in to manage your finances</p>
                </div>

                {authError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {authError}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={clearError}
                    ></button>
                  </div>
                )}

                <div className="d-grid gap-3">
                  <button
                    className="btn btn-outline-primary btn-lg"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fab fa-google me-2"></i>
                        Continue with Google
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    <i className="fas fa-user me-2"></i>
                    Continue as Demo
                  </button>

                  <hr className="my-3" />

                  <form onSubmit={handleEmailLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In with Email"}
                    </button>
                  </form>
                </div>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Firebase authentication with offline-first local fallback
                  </small>
                </div>

                <div className="text-center mt-3">
                  <Link to="/" className="btn btn-link text-muted">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
