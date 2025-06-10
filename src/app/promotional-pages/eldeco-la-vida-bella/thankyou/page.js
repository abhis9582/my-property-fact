"use client";

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="sticky top-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          
        
        </div>
      </nav>

      <section className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="max-w-[600px] text-center rounded-3xl shadow-md p-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Thank You!
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            We appreciate your submission. Our team will get back to you shortly.
          </p>
          <Link
            href="/"
            aria-label="Back to Home"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

