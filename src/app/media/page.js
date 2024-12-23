import Link from "next/link";
import Footer from "../components/footer/page";
import Header from "../components/header/page";
import "./media.css";
export default function Media() {
  const blogsList = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <>
      <Header />
      <div className="container-fluid mt-5">
        <img
          src="https://www.starestate.com/assets/images/blog.jpg"
          alt="blogs banner"
        />
      </div>
      <div className="w-100 mt-3">
        <div className="container-lg bg-light">
          <div className="breadcrumbContainer" aria-label="breadcrumb">
            <ol className="breadcrumb p-3">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">Blogs</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-3">
        <p className="text-center h2 mt-3">Blogs</p>
        <div className="d-flex justify-content-center flex-wrap">
          {blogsList.map((blog) => (
            <div key={blog} className="card m-2">
              <img
                src="https://ecis.in/apis/star-estate-API/star_estate/blogs/2024-11-27_10-37-27_setdesignerworkindoors.webp"
                alt="blog"
              />
              <div className="p-2 mb-3">
                <p className="h5 text-bold">Checkout the Best Residential Projects in Lucknow</p>
                <small>Continue Reading...</small>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
