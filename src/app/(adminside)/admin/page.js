"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./dashboard/dashboard.css";
import Image from "next/image";
import Cookies from "js-cookie";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { toast } from "react-toastify";
export default function AdminPage() {
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showLoading, setShowLoading] = useState(false);
  const [buttonName, setButtonName] = useState("Go to dashboard");
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      setShowLoading(true);
      setButtonName("");
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "auth/login",
        formData,
        { withCredentials: true } // Ensure cookies are included in the request
      );
      if (response.status === 200) {
        const { token, refreshToken } = response.data;
        console.log(response);
        
        // Store token (24 hours)
        Cookies.set("token", token, {
          expires: 1, // 1 day = 24 hours
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          path: "/",
        });

        // Store refresh token (7 days)
        Cookies.set("refreshToken", refreshToken, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          path: "/",
        });

        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Invalid username or password!");
      console.log(error);
    } finally {
      setShowLoading(false);
      setButtonName("Go to dashboard");
    }
  };

  //Setting form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-5 border border-success">
          <h3 className="text-center mb-4">
            <Image
              height={100}
              width={100}
              alt="project-logo"
              src="/logo.png"
            />
          </h3>
          <form
            noValidate
            className={validated ? "was-validated" : ""}
            onSubmit={handleSubmit}
          >
            <div className="form-group mb-4">
              <input
                type="email"
                className="form-control border border-success"
                id="exampleInputEmail1"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Username or email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Enter a valid username!</div>
            </div>
            <div className="form-group mb-4">
              <input
                type="password"
                className="form-control border border-success"
                id="exampleInputPassword1"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Enter a valid password!</div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-success"
                disabled={showLoading}
              >
                {buttonName} <LoadingSpinner show={showLoading} />
              </button>
            </div>
            <div className="text-center mt-2">
              <Link className="text-dark text-decoration-none" href="#">
                Forget Password?
              </Link>
            </div>
            <div className="text-center mt-2">
              <Link className="text-dark text-decoration-none" href="#">
                Register?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
