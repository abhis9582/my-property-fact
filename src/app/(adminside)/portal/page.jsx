"use client";

import { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";

export default function PortalSignInPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [receivedOTP, setReceivedOTP] = useState("");
  const [error, setError] = useState("");
  const [googleLoginEnabled, setGoogleLoginEnabled] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token") || Cookies.get("authToken");
    if (token) {
      // Use router for existing sessions to maintain SPA behavior
      router.replace("/portal/dashboard");
    }
  }, [router]);

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}auth/google`,
        { token: token }
      );
      
      if (response.data.token) {
        const authToken = response.data.token;
        
        Cookies.set("token", authToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });
        Cookies.set("authToken", authToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });

        if (response.data.refreshToken) {
          Cookies.set("refreshToken", response.data.refreshToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          });
        }

        if (response.data.user) {
          Cookies.set("userData", JSON.stringify(response.data.user), {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          });
        }

        // Use window.location for immediate navigation (bypasses Next.js router delay)
        window.location.href = "/portal/dashboard";
      }
    } catch (error) {
      setError(error.response?.data?.message || "Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError("Google login failed. Please try again.");
    setGoogleLoginEnabled(false);
  };

  const handlePhoneAuth = async (isSignup = false) => {
    if (!formData.phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (isSignup && !formData.fullName) {
      setError("Please enter your full name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}auth/send-otp`,
        { phoneNumber: formData.phoneNumber }
      );

      if (response.data.success) {
        setShowOTP(true);
        if (response.data.otp) {
          setReceivedOTP(response.data.otp);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to send OTP. Please check your phone number and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (isSignup = false) => {
    if (!formData.otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const requestData = {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp,
      };

      if (isSignup && formData.fullName) {
        requestData.fullName = formData.fullName;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}auth/verify-otp`,
        requestData
      );

      if (response.data.token) {
        const authToken = response.data.token;
        
        Cookies.set("token", authToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });
        Cookies.set("authToken", authToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });

        if (response.data.refreshToken) {
          Cookies.set("refreshToken", response.data.refreshToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          });
        }

        if (response.data.user) {
          Cookies.set("userData", JSON.stringify(response.data.user), {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          });
        }

        setFormData({ phoneNumber: "", otp: "", fullName: "" });
        setShowOTP(false);
        setReceivedOTP("");
        
        // Use window.location for immediate navigation (bypasses Next.js router delay)
        // This is faster than router.push/replace because it doesn't wait for middleware verification
        window.location.href = "/portal/dashboard";
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Invalid OTP. Please check the code and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      const limitedValue = digitsOnly.slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: limitedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setShowOTP(false);
    setFormData({ phoneNumber: "", otp: "", fullName: "" });
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0]?.includes?.("GSI_LOGGER") ||
        args[0]?.includes?.("origin is not allowed") ||
        args[0]?.includes?.("client ID")
      ) {
        setGoogleLoginEnabled(false);
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="auth-page-container">
        {/* Left Side - Features List */}
        <div className="auth-features-panel">
          <div className="features-content">
            <h2 className="features-title">Features of a My Property Fact Account</h2>
            <ul className="features-list">
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>List unlimited properties for free every day</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Set up personalized property alerts</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Connect with buyers across the nation</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Showcase your property for Rent or Sale</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Receive quick inquiries via phone, email, and SMS</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Track search performance and monitor responses and views online</span>
              </li>
              <li className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Add extensive property details and multiple photos per listing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <div className="form-header-area">
              <h1 className="form-main-heading">Log In or Sign Up</h1>
            </div>

            <div className="form-tabs-area">
              <button
                className={`form-tab-button ${activeTab === "signin" ? "active" : ""}`}
                onClick={() => switchTab("signin")}
              >
                Sign In
              </button>
              <span className="tab-separator">or</span>
              <button
                className={`form-tab-button ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => switchTab("signup")}
              >
                Sign Up
              </button>
            </div>

            <div className="form-body-area">
              {error && (
                <div className="error-message-box">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Sign In Panel */}
              <div className={`form-panel-wrapper ${activeTab === "signin" ? "active" : ""}`}>
                {!showOTP ? (
                  <>
                    <div className="phone-input-group">
                      <label className="input-label-text">Phone Number</label>
                      <div className="phone-input-wrapper">
                        <div className="country-code">
                          <span className="flag-icon">🇮🇳</span>
                          <span className="code-text">(91)</span>
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="10 digit phone number"
                          maxLength={10}
                          disabled={isLoading}
                          className="phone-input-field"
                        />
                      </div>
                    </div>

                    <button
                      className="primary-action-button"
                      onClick={() => handlePhoneAuth(false)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Sending OTP...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {receivedOTP && (
                      <div className="info-message-box">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                          <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Development OTP: <strong>{receivedOTP}</strong></span>
                      </div>
                    )}
                    
                    <div className="phone-input-group">
                      <label className="input-label-text">Enter OTP</label>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        disabled={isLoading}
                        className="phone-input-field otp-field"
                      />
                    </div>

                    <button
                      className="primary-action-button"
                      onClick={() => handleOTPVerify(false)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>

                    <button
                      type="button"
                      className="secondary-link-button"
                      onClick={() => {
                        setShowOTP(false);
                        setFormData((prev) => ({ ...prev, otp: "" }));
                      }}
                      disabled={isLoading}
                    >
                      Change Phone Number
                    </button>
                  </>
                )}

                {googleClientId && googleLoginEnabled && (
                  <>
                    <div className="divider-section">
                      <span>OR</span>
                    </div>
                    <div className="google-auth-section">
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap={false}
                        theme="outline"
                        size="large"
                        text="signin_with"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Sign Up Panel */}
              <div className={`form-panel-wrapper ${activeTab === "signup" ? "active" : ""}`}>
                {!showOTP ? (
                  <>
                    <div className="phone-input-group">
                      <label className="input-label-text">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        disabled={isLoading}
                        className="phone-input-field"
                      />
                    </div>

                    <div className="phone-input-group">
                      <label className="input-label-text">Phone Number</label>
                      <div className="phone-input-wrapper">
                        <div className="country-code">
                          <span className="flag-icon">🇮🇳</span>
                          <span className="code-text">(91)</span>
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="10 digit phone number"
                          maxLength={10}
                          disabled={isLoading}
                          className="phone-input-field"
                        />
                      </div>
                    </div>

                    <button
                      className="primary-action-button"
                      onClick={() => handlePhoneAuth(true)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Sending OTP...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {receivedOTP && (
                      <div className="info-message-box">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                          <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Development OTP: <strong>{receivedOTP}</strong></span>
                      </div>
                    )}
                    
                    <div className="phone-input-group">
                      <label className="input-label-text">Enter OTP</label>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        disabled={isLoading}
                        className="phone-input-field otp-field"
                      />
                    </div>

                    <button
                      className="primary-action-button"
                      onClick={() => handleOTPVerify(true)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP & Sign Up"
                      )}
                    </button>

                    <button
                      type="button"
                      className="secondary-link-button"
                      onClick={() => {
                        setShowOTP(false);
                        setFormData((prev) => ({ ...prev, otp: "" }));
                      }}
                      disabled={isLoading}
                    >
                      Change Phone Number
                    </button>
                  </>
                )}

                {googleClientId && googleLoginEnabled && (
                  <>
                    <div className="divider-section">
                      <span>OR</span>
                    </div>
                    <div className="google-auth-section">
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap={false}
                        theme="outline"
                        size="large"
                        text="signup_with"
                      />
                    </div>
                  </>
                )}
              </div>

              <p className="terms-text">
                By clicking "continue with Google or Phone number" above, you acknowledge that you have read and understood, and agree to{" "}
                <a href="#" className="terms-link">Privacy Policy</a> and{" "}
                <a href="#" className="terms-link">Terms and Conditions</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
