"use client";
import "./media.css";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
export default function Media() {
  // defining state for list of blogs
  const [blogsList, setBlogsList] = useState([]);

  //fetching all blogs list
  const getBlogsList = async () => {
    // fetching blogs list from api
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}blog/get-all`);
    setBlogsList(response.data);
  }
  useEffect(() => {
    getBlogsList();

  }, []);
  if (blogsList.length === 0) {
    return <>
      <CommonHeaderBanner image={"blog-banner.jpg"} headerText={"Blog"} />
      <CommonBreadCrum pageName={"Blog"} />
      <div className="text-center fs-2 font-bold my-5">No blogs found!</div>
    </>
  }
  return (
    <>
      <CommonHeaderBanner image={"blog-banner.jpg"} headerText={"Blog"} />
      <CommonBreadCrum pageName={"Blog"} />
      <div className="container-fluid mt-3">
        {/* <p className="text-center h2 mt-3">Blog</p> */}
        <div className="container d-flex justify-content-center gap-4 flex-wrap">
          {blogsList.map((blog, index) => (
            <Link href={`/blog/${blog.slugUrl}`}
              key={`${blog.blogTitle}-${index}`}
              className="card shadow-sm border-0 rounded-4 overflow-hidden"
              style={{ width: '22rem', transition: 'transform 0.3s' }}
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
                <h5 className="card-title fw-bold">{blog.blogTitle}</h5>
                <p className="card-text text-muted small">
                  {blog.shortDescription || 'Click below to continue reading...'}
                </p>
                <button className="btn btn-primary btn-sm mt-2">
                  Continue Reading
                </button>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}
