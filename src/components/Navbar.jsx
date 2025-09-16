import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, setLoading, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For demo purposes, simulate login
      setTimeout(() => {
        login({ email, id: Date.now() });
        setLoading(false);
      }, 1000);
    } catch (error) {
      // console.error("Auth error:", error);
      alert("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center" style={{ minHeight: "100vh", alignItems: "center" }}>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="h3 mb-3">💰 MCC Finance</h1>
                <p className="text-muted">
                  {isLogin ? "Sign in to your account" : "Create a new account"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>
              
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
