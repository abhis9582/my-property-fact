"use client";
import "./media.css";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { LoadingSpinner } from "../contact-us/page";
export default function Media() {
  // defining state for list of blogs
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  //fetching all blogs list
  const getBlogsList = async () => {
    // fetching blogs list from api
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}blog/get-all`);
    setBlogsList(response.data);
    setLoading(false);
  }
  useEffect(() => {
    getBlogsList();

  }, []);

  //adding pagination to this blogs list
  const totalNumberOfBlogs = blogsList.length;
  const blogsToShowOnSinglePage = 3;
  const numberOfPages = totalNumberOfBlogs / blogsToShowOnSinglePage;


  return (
    <>
      <CommonHeaderBanner image={"blog-banner.jpg"} headerText={"Blog"} />
      <CommonBreadCrum pageName={"Blog"} />
      <div className="container-fluid mb-3">
        {/* <p className="text-center h2 mt-3">Blog</p> */}
        <div className="container-fluid d-flex justify-content-center gap-4 flex-wrap">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
              <LoadingSpinner show={loading} />
            </div>)
            :
            blogsList.map((blog, index) => (
              <Link href={`/blog/${blog.slugUrl}`}
                key={`${blog.blogTitle}-${index}`}
                className="card border-0 rounded-4 overflow-hidden custom-shadow"
                style={{ width: '27rem', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Image
                  width={400}
                  height={250}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}blog/${blog.blogImage}`}
                  alt={blog.blogTitle}
                  className="card-img-top"
                  unoptimized={true}
                />
                <div className="card-body">
                  <h4 className="card-title fw-bold">{blog.blogTitle}</h4>
                  <p className="card-text text-muted small">
                    {blog.blogMetaDescription || 'Click below to continue reading...'}
                  </p>
                  <button className="btn btn-background text-white btn-sm mt-2">
                    Continue Reading
                  </button>
                </div>
              </Link>
            ))}
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div>
            {numberOfPages > 1 ?
              <div>
                {Array.from({ length: numberOfPages }, (_, index) => (
                  <span className="fs-4 fw-bold btn-background mx-2 p-3 m-0 pt-5 rounded" key={index}>{index + 1} </span>
                ))}
              </div>
              : ""}
          </div>
        </div>
      </div>
    </>
  );
}
