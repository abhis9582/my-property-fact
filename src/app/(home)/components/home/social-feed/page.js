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
          <div className="d-flex gap-3">
            {blogsList.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        }
      </div>
    </>
  );
}
