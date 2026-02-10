"use client";
import "./page.module.css";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
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
  const [searchBlogs, setSearchBlogs] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  //fetching all blogs list
  const getBlogsList = async () => {
    const blogsList = await fetchBlogs(page, size, "");
    setBlogsList(blogsList.content);
    setSearchBlogs(blogsList.content);
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

  // Handling search for the blogs
  const handleSearch = async (e) => {
    setIsSearch(true);
    const searchQuery = e.target.value;
    const blogs = await fetchBlogs(page, size, "search");
    const filteredBlogs = blogs.content.filter((blog) =>
      blog.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchBlogs(filteredBlogs);
    setLoading(false);
  };

  return (
    <>
      <CommonHeaderBanner
        image={"blog-banner.jpg"}
        headerText={"Blog"}
        pageName={"Blog"}
      />
      {/* <CommonBreadCrum pageName={"Blog"} /> */}
      <div className="container my-3 my-lg-5 px-3 px-lg-5">
        {/* <p className="text-center h2 mt-3">Blog</p> */}
        <div className="row">
          <div className="d-flex align-items-center gap-2 justify-content-start">
            <div className="col-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search Blogs by Title"
              onChange={(e) => handleSearch(e)}
            />
            </div>
          </div>
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "250px" }}
            >
              <LoadingSpinner show={loading} />
            </div>
          ) : (
            searchBlogs.map((blog, index) => (
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
      {!isSearch && (
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
      )}
    </>
  );
}
