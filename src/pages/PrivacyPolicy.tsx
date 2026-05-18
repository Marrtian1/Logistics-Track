"use client";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 bg-white px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-primary">Privacy Policy</h1>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/")}>
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Privacy Policy for Maritrack Systems</h2>
        <p className="text-lg mb-4">At Maritrack Systems, we are committed to protecting your privacy and ensuring the security of your data. This policy outlines how we collect, use, and safeguard your information.</p>

        <h3 className="text-xl font-bold text-primary mb-2">Data Collection</h3>
        <p className="text-lg mb-4">We collect the following types of data:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>User account information (email, password)</li>
          <li>Shipment tracking details</li>
          <li>Location data from vessel tracking</li>
          <li>System usage statistics</li>
        </ul>

        <h3 className="text-xl font-bold text-primary mb-2">Data Security</h3>
        <p className="text-lg mb-4">We employ industry-standard security measures to protect your data:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Encryption of all data in transit and at rest</li>
          <li>Regular security audits and penetration testing</li>
          <li>Role-based access controls</li>
          <li>Two-factor authentication for administrative access</li>
        </ul>

        <h3 className="text-xl font-bold text-primary mb-2">Data Usage</h3>
        <p className="text-lg mb-4">Your data is used to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide vessel tracking and logistics services</li>
          <li>Improve system performance and reliability</li>
          <li>Comply with legal and regulatory requirements</li>
          <li>Prevent fraud and unauthorized access</li>
        </ul>

        <h3 className="text-xl font-bold text-primary mb-2">Third-Party Sharing</h3>
        <p className="text-lg mb-4">We do not share your personal data with third parties except as required by law or with your explicit consent.</p>

        <h3 className="text-xl font-bold text-primary mb-2">Data Retention</h3>
        <p className="text-lg mb-4">We retain data for as long as necessary to provide services and comply with legal obligations. User accounts are deleted after 90 days of inactivity.</p>

        <h3 className="text-xl font-bold text-primary mb-2">User Rights</h3>
        <p className="text-lg mb-4">You have the following rights regarding your data:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access and review your personal information</li>
          <li>Request correction or deletion of your data</li>
          <li>Opt out of data collection for marketing purposes</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h3 className="text-xl font-bold text-primary mb-2">Contact Us</h3>
        <p className="text-lg mb-4">For questions about this policy or your data, contact us at:</p>
        <div className="flex items-center gap-2">
          <a href="mailto:privacy@maritrack.com" className="text-primary hover:underline">privacy@maritrack.com</a>
          <span className="text-muted-foreground">|</span>
          <a href="#" className="text-primary hover:underline">Contact Form</a>
        </div>
      </main>

      <footer className="h-16 border-t bg-white px-6 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest">
        <div>© 2024 Maritrack Systems International</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;