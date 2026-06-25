import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Terms of Service</li>
            </ol>
          </nav>
          
          <h1 className="mb-4">Terms of Service</h1>
          
          <div className="card">
            <div className="card-body">
              <p className="lead">
                By using MCC Finance Planner, you agree to these terms and conditions.
              </p>
              
              <h3>Acceptance of Terms</h3>
              <p>
                By accessing and using this application, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
              
              <h3>Description of Service</h3>
              <p>
                MCC Finance Planner is a personal finance management application that helps you track 
                income, expenses, create budgets, and manage financial goals. The service is provided 
                "as is" without warranty of any kind.
              </p>
              
              <h3>User Responsibilities</h3>
              <ul>
                <li>Maintain the security of your account credentials</li>
                <li>Ensure accuracy of financial data you input</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
              </ul>
              
              <h3>Data Ownership</h3>
              <p>
                You retain full ownership of your financial data. We provide tools to export your data 
                at any time. Upon account deletion, all your data is permanently removed.
              </p>
              
              <h3>Limitation of Liability</h3>
              <p>
                MCC Finance Planner is provided as a personal tool. We are not responsible for any 
                financial decisions made based on the information in our application. Always consult 
                with qualified financial advisors for important financial decisions.
              </p>
              
              <h3>Service Availability</h3>
              <p>
                While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. 
                We recommend regular data exports as backup.
              </p>
              
              <h3>Prohibited Uses</h3>
              <ul>
                <li>Commercial use without explicit permission</li>
                <li>Attempting to reverse engineer the application</li>
                <li>Using the service for illegal activities</li>
                <li>Sharing account credentials with others</li>
              </ul>
              
              <h3>Updates to Terms</h3>
              <p>
                We may update these terms from time to time. Users will be notified of significant 
                changes via email or in-app notification.
              </p>
              
              <h3>Termination</h3>
              <p>
                You may terminate your account at any time. We reserve the right to terminate accounts 
                that violate these terms of service.
              </p>
              
              <h3>Contact Information</h3>
              <p>
                For questions about these terms, please contact us through our 
                <a href="https://github.com/michael-mpj/MCC-Finance-Planner/issues"> GitHub repository</a>.
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

export default TermsOfService;