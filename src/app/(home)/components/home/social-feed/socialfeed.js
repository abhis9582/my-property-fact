"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import BlogCard from "../../common/blogcard";

export default function SocialFeed({ data }) {
  return (
    <div className="container pb-4">
      {data?.length < 0 ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "250px" }}
        >
          <LoadingSpinner show={true} />
        </div>
      ) : (
        <div className="container">
          <div className="row">
            {data?.map((blog, index) => {
              // Always show first two cards
              if (index < 2) {
                return (
                  <div key={index} className="col-12 col-md-6 col-lg-4 d-flex">
                    <BlogCard blog={blog} />
                  </div>
                );
              }

              // Show the 3rd card only on large screens and up
              if (index === 2) {
                return (
                  <div
                    key={index}
                    className="col-12 col-md-6 col-lg-4 d-none d-lg-flex justify-content-between"
                  >
                    <BlogCard blog={blog} />
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
