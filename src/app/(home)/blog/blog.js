"use client";
import "./page.module.css";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../contact-us/page";
import { Pagination, Stack } from "@mui/material";
import BlogCard from "../components/common/blogcard";
import { fetchBlogs } from "@/app/_global_components/masterFunction";
export default function Blog() {
  // defining state for list of blogs
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  //fetching all blogs list
  const getBlogsList = async () => {
    const blogsList = await fetchBlogs(page, size);
    setBlogsList(blogsList.content);
    setTotalPages(blogsList.totalPages);
    setLoading(false);
  };
  useEffect(() => {
    getBlogsList();
  }, [page]);

  // Handle page change from pagination
  const handlePageChange = (event, value) => {
    event.preventDefault();
    setPage(value - 1); // update page state, which triggers useEffect
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <CommonHeaderBanner image={"blog-banner.jpg"} headerText={"Blog"} 
      pageName={"Blog"}
      />
      {/* <CommonBreadCrum pageName={"Blog"} /> */}
      <div className="container-fluid my-3 my-lg-5 px-3 px-lg-5">
        {/* <p className="text-center h2 mt-3">Blog</p> */}
        <div className="row">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "250px" }}
            >
              <LoadingSpinner show={loading} />
            </div>
          ) : (
            blogsList.map((blog, index) => (
              <div
                className="col-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-4"
                key={index}
              >
                <BlogCard key={index} blog={blog} index={index} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center my-5">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page + 1}
            color="secondary"
            onChange={handlePageChange}
          />
        </Stack>
      </div>
    </>
  );
}
