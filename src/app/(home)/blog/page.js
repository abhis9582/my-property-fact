"use client";
import "./media.css";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "../contact-us/page";
import { Pagination, Stack } from "@mui/material";
import BlogCard from "../components/common/blogcard";
export default function Media() {
  // defining state for list of blogs
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  //fetching all blogs list
  const getBlogsList = async () => {
    // fetching blogs list from api
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}blog/get?page=${page}&size=${size}`);
    setBlogsList(response.data.content);
    setTotalPages(response.data.totalPages);
    setLoading(false);
  }
  useEffect(() => {
    getBlogsList();
  }, [page]);

  // Handle page change from pagination
  const handlePageChange = (event, value) => {
    setPage(value - 1); // update page state, which triggers useEffect
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <CommonHeaderBanner image={"blog-banner.jpg"} headerText={"Blog"} />
      <CommonBreadCrum pageName={"blog"} />
      <div className="container-fluid mb-3">
        {/* <p className="text-center h2 mt-3">Blog</p> */}
        <div className="container-fluid d-flex justify-content-center gap-4 flex-wrap">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
              <LoadingSpinner show={loading} />
            </div>)
            :
            blogsList.map((blog, index) => (
              <BlogCard key={index} blog={blog} index={index} />
            ))}
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center my-5">
        {/* <div>
          {numberOfPages > 1 ?
            <div>
              {Array.from({ length: numberOfPages }, (_, index) => (
                <span className="fs-4 fw-bold btn-background mx-2 p-3 rounded" key={index}>{index + 1} </span>
              ))}
            </div>
            : ""}
        </div> */}
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            color="secondary"
            onChange={handlePageChange}
          />
        </Stack>
      </div>
    </>
  );
}
