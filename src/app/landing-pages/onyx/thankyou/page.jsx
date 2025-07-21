"use client";

import Link from "next/link";

export default function page() {
  return (
    <main
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ backgroundColor: "#f0fdf4" }}
    >
      <div className="text-center p-4">
        <h1 className="display-4 fw-bold text-success mb-4">Thank You!</h1>
        <p className="fs-5 text-secondary mb-4">
          Your message has been successfully submitted.
        </p>
        <Link
          href="/landing-pages/onyx"
          className="btn btn-success btn-lg fw-semibold px-5 py-2"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
