"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../admin/dashboard/dashboard.css";
import Image from "next/image";
export default function AdminPage() {
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true); // Ensure it's a boolean
      return;
    }
    setValidated(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "auth/login",
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        router.push("admin/dashboard");
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically set the value based on the input's name attribute
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
              <button type="submit" className="btn btn-primary">
                Go to dashboard
              </button>
            </div>
            <div className="text-center mt-2">
              <Link href="#">Forget Password?</Link>
            </div>
            <div className="text-center mt-2">
              <Link href="#">Register?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
