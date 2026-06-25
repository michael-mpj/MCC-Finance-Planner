import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Privacy Policy</li>
            </ol>
          </nav>

          <h1 className="mb-4">Privacy Policy</h1>

          <div className="card">
            <div className="card-body">
              <p className="lead">
                At MCC Finance Planner, we take your privacy seriously. This policy explains how we
                collect, use, and protect your personal information.
              </p>

              <h3>Information We Collect</h3>
              <ul>
                <li>
                  <strong>Account Information:</strong> Email address and encrypted password for
                  authentication
                </li>
                <li>
                  <strong>Financial Data:</strong> Transaction records, categories, and budgets you
                  create
                </li>
                <li>
                  <strong>Usage Data:</strong> How you interact with our application for improving
                  user experience
                </li>
              </ul>

              <h3>How We Use Your Information</h3>
              <ul>
                <li>Provide and maintain our finance tracking service</li>
                <li>Sync your data across devices securely</li>
                <li>Send important service notifications</li>
                <li>Improve our application based on usage patterns</li>
              </ul>

              <h3>Data Security</h3>
              <p>
                Your financial data is encrypted both in transit and at rest. We use Firebase&apos;s
                secure infrastructure with industry-standard security measures. Your data is
                isolated per user account and never shared with third parties.
              </p>

              <h3>Your Rights</h3>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and all associated data</li>
                <li>Export your data in JSON format</li>
              </ul>

              <h3>Data Retention</h3>
              <p>
                We retain your data as long as your account is active. If you delete your account,
                all personal data is permanently removed from our systems within 30 days.
              </p>

              <h3>Contact Us</h3>
              <p>
                If you have questions about this privacy policy, please contact us through our
                <a href="https://github.com/michael-mpj/MCC-Finance-Planner/issues">
                  {" "}
                  GitHub issues page
                </a>
                .
              </p>

              <p className="text-muted mt-4">
                <small>Last updated: September 17, 2025</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
