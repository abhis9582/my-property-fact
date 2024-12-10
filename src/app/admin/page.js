"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../admin/dashboard/dashboard.css";
export default function AdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "auth/login",
      formData
    );
    if (response.status === 200) {
      router.push("admin/dashboard");
      localStorage.setItem("token", response.data.token);
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
        <div className="card p-5">
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              {/* <label htmlFor="exampleInputEmail1">Email address</label> */}
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Username or email"
                value={formData.email}
                onChange={handleChange}
              />
              {/* <div class="invalid-feedback">Please choose a username.</div> */}
            </div>
            <div className="form-group mb-4">
              {/* <label htmlFor="exampleInputPassword1">Password</label> */}
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <div className="text-center mt-2">
              <Link href="#">Forget Password ?</Link>
            </div>
            <div className="text-center mt-2">
              <Link href="#">Register ?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
