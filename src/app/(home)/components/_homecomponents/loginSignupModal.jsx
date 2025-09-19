"use client";

import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./loginSignup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginSignupModal({ show, handleClose }) {
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    // Send token to your Spring Boot backend for verification
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}auth/google`,
      {
        token: token,
      }
    );
    if (response.data.token) {
      const token = response.data.token;
      Cookies.set("token", token, {
        expires: 7, // Token expires in 7 days
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Prevent CSRF issues
        path: "/", // Available across the site
      });
      router.push("/dashboard");
      handleClose(false);
    }
    console.log("Backend response:", response.data);
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)} centered size="lg">
      <div
        className={`${styles.authWrapper} ${
          isRightPanelActive ? styles.rightPanelActive : ""
        }`}
        id="auth-container"
      >
        {/* Sign Up */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form>
            <h1>Create Account</h1>
            <div className={styles.socialContainer}>
              <a
                href="#"
                className="d-flex align-items-center justify-content-center border p-2 rounded-3"
              >
                <Image
                  src="/static/google_image.png"
                  alt="google_image"
                  className="me-3"
                  width={30}
                  height={30}
                />
                <p className="p-0 m-0 text-dark fw-bold me-3">
                  Sign up with google
                </p>
              </a>
            </div>
            <span>or use your phone for registration</span>
            <input className="mb-3" type="tel" placeholder="Mobile Number" />
            <button type="button">Sign Up</button>
          </form>
        </div>

        {/* Sign In */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form>
            <h1>Sign in</h1>
            <div className={styles.socialContainer}>
              {/* <a
                href="#"
                className="d-flex align-items-center justify-content-center border p-2 rounded-3"
              >
                <Image
                  src="/static/google_image.png"
                  alt="google_image"
                  className="me-3"
                  width={30}
                  height={30}
                />
                <p className="p-0 m-0 text-dark fw-bold">Sign in with google</p>
              </a> */}
              <GoogleOAuthProvider
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              >
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </GoogleOAuthProvider>
            </div>
            <span>or use your whats app number</span>
            <input className="mb-3" type="tel" placeholder="Mobile Number" />
            <button type="button">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
