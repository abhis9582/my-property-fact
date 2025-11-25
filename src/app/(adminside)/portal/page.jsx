"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import "./portal-signin.css";

export default function PortalSignInPage() {
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
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

  // Check if user is already logged in
  useEffect(() => {
    const token = Cookies.get("token") || Cookies.get("authToken");
    if (token) {
      // Verify token is still valid before redirecting
      router.push("/portal/dashboard");
    }
  }, [router]);

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}auth/google`,
        {
          token: token,
        }
      );
      
      if (response.data.token) {
        const authToken = response.data.token;
        
        // Store tokens (both token and authToken for compatibility)
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

        // Store user data
        if (response.data.user) {
          Cookies.set("userData", JSON.stringify(response.data.user), {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          });
        }

        router.push("/portal/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError("Google login failed. Please try again.");
    // Silently disable Google login if there's a configuration error
    setGoogleLoginEnabled(false);
  };

  // Handle manual phone number login/signup
  const handlePhoneAuth = async (isSignup = false) => {
    if (!formData.phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    // Validate phone number is exactly 10 digits
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    // For signup, also require name
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
        // Store the OTP for development (will be removed in production)
        if (response.data.otp) {
          setReceivedOTP(response.data.otp);
        }
      }
    } catch (error) {
      // Show user-friendly error messages
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to send OTP. Please check your phone number and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
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

      // Add fullName for signup
      if (isSignup && formData.fullName) {
        requestData.fullName = formData.fullName;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}auth/verify-otp`,
        requestData
      );

      if (response.data.token) {
        const authToken = response.data.token;
        
        // Store token (both token and authToken for compatibility)
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

        // Store refresh token
        if (response.data.refreshToken) {
          Cookies.set("refreshToken", response.data.refreshToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          });
        }

        // Store user data
        if (response.data.user) {
          Cookies.set("userData", JSON.stringify(response.data.user), {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          });
        }

        // Reset form
        setFormData({ phoneNumber: "", otp: "", fullName: "" });
        setShowOTP(false);
        setReceivedOTP("");
        
        router.push("/portal/dashboard");
      }
    } catch (error) {
      // Show user-friendly error messages
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Invalid OTP. Please check the code and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate phone number input - only allow digits, max 10 digits
    if (name === "phoneNumber") {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      // Limit to 10 digits
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

  const togglePanel = () => {
    setIsRightPanelActive(!isRightPanelActive);
    setError("");
    setShowOTP(false);
    setFormData({ phoneNumber: "", otp: "", fullName: "" });
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Suppress Google Sign-In console errors
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0]?.includes?.("GSI_LOGGER") ||
        args[0]?.includes?.("origin is not allowed") ||
        args[0]?.includes?.("client ID")
      ) {
        // Silently ignore Google Sign-In configuration errors
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
      <div className="portal-signin-container">
        <div className={`portal-signin-wrapper ${isRightPanelActive ? "right-panel-active" : ""}`}>
          {/* Sign In Panel */}
          <div className="portal-signin-panel portal-signin-panel-left">
            <div className="portal-signin-content">
              <h2>Welcome Back!</h2>
              <p>Sign in to access your property portal</p>
              
              {error && (
                <Alert variant="danger" className="mt-3 mb-3">
                  {error}
                </Alert>
              )}

              {!showOTP ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      disabled={isLoading}
                    />
                    <Form.Text className="text-muted">
                      Enter 10 digits only (e.g., 9876543210)
                    </Form.Text>
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mb-3"
                    onClick={() => handlePhoneAuth(false)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {receivedOTP && (
                    <Alert variant="info" className="mb-3">
                      <small>Development OTP: <strong>{receivedOTP}</strong></small>
                    </Alert>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mb-3"
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
                  </Button>

                  <Button
                    variant="link"
                    className="w-100"
                    onClick={() => {
                      setShowOTP(false);
                      setFormData((prev) => ({ ...prev, otp: "" }));
                    }}
                    disabled={isLoading}
                  >
                    Change Phone Number
                  </Button>
                </>
              )}

              {googleClientId && googleLoginEnabled && (
                <>
                  <div className="portal-divider">
                    <span>OR</span>
                  </div>

                  <div className="portal-social-login">
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

              <p className="portal-signup-link">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="portal-link-button"
                  onClick={togglePanel}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>

          {/* Sign Up Panel */}
          <div className="portal-signin-panel portal-signin-panel-right">
            <div className="portal-signin-content">
              <h2>Create Account!</h2>
              <p>Sign up to start listing your properties</p>
              
              {error && (
                <Alert variant="danger" className="mt-3 mb-3">
                  {error}
                </Alert>
              )}

              {!showOTP ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      disabled={isLoading}
                    />
                    <Form.Text className="text-muted">
                      Enter 10 digits only (e.g., 9876543210)
                    </Form.Text>
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mb-3"
                    onClick={() => handlePhoneAuth(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {receivedOTP && (
                    <Alert variant="info" className="mb-3">
                      <small>Development OTP: <strong>{receivedOTP}</strong></small>
                    </Alert>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mb-3"
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
                  </Button>

                  <Button
                    variant="link"
                    className="w-100"
                    onClick={() => {
                      setShowOTP(false);
                      setFormData((prev) => ({ ...prev, otp: "" }));
                    }}
                    disabled={isLoading}
                  >
                    Change Phone Number
                  </Button>
                </>
              )}

              {googleClientId && googleLoginEnabled && (
                <>
                  <div className="portal-divider">
                    <span>OR</span>
                  </div>

                  <div className="portal-social-login">
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

              <p className="portal-signup-link">
                Already have an account?{" "}
                <button
                  type="button"
                  className="portal-link-button"
                  onClick={togglePanel}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Overlay Panel */}
          <div className="portal-signin-overlay">
            <div className="portal-signin-overlay-panel">
              <div className="portal-signin-overlay-left">
                <h2>New here?</h2>
                <p>Sign up and start listing your properties today!</p>
                <Button
                  variant="outline-light"
                  className="portal-ghost-button"
                  onClick={togglePanel}
                >
                  Sign Up
                </Button>
              </div>
              <div className="portal-signin-overlay-right">
                <h2>Welcome back!</h2>
                <p>Sign in to access your property portal</p>
                <Button
                  variant="outline-light"
                  className="portal-ghost-button"
                  onClick={togglePanel}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
