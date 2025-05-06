"use client";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import "./social-feed.css";
import BlogCard from "../../common/blogcard";
import { useEffect, useState } from "react";
import axios from "axios";
export default function SocialFeed() {
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBlogsList = async () => {
    // fetching blogs list from api
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}blog/get?page=${0}&size=${3}`);
    setBlogsList(response.data.content);
    setLoading(false);
  }

  useEffect(() => {
    getBlogsList();
  }, []);

  return (
    <>
      <div className="container pb-4">
        {loading ? <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "250px" }}>
          <LoadingSpinner show={loading} />
        </div> :
          <div className="container">
            <div className="row">
              {blogsList.map((blog, index) => (
                <div key={index} className="col-md-4 col-lg-4 col-sm-12 my-3">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </>
  );
}
